mod helpers;

use log::*;
use serde_derive::{Deserialize, Serialize};
// use strum::IntoEnumIterator;
use strum_macros::{EnumIter, ToString};
// use yew::format::Json;
use yew::services::storage::{Area, StorageService};
use yew::services::fetch::{FetchService, FetchTask, Request, Response};
use yew::format::{Json, Nothing};
use yew::prelude::*;
use anyhow::Error;
use std::collections::HashMap;

const API_ENDPOINT: &str = "https://pomber.github.io/covid19/timeseries.json";

type AsBinary = bool;

pub struct App {
    link: ComponentLink<Self>,
    storage: StorageService,
    state: State,
    fetch_service: FetchService,
    ft: Option<FetchTask>,
}

#[derive(Serialize, Deserialize)]
pub struct State {
    countries: Vec<Country>,
    sort: Sort,
    page: usize,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Country {
    name: String,
    rank: isize,
    last_rank: isize,
    rank_changed: isize,
    confirmed: usize,
    deaths: usize,
    recovered: usize
}

pub enum Msg {
    SetSort(Sort),
    SetPage(usize),
    FetchData,
    FetchReady(Result<RawCountryData, Error>),
    Ignore,
}

#[derive(Serialize, Deserialize, Debug, Copy, Clone)]
pub struct RawCountry {
    // date: String, skip to derive Copy
    confirmed: usize,
    deaths: usize,
    recovered: usize,
}

type RawCountryData = HashMap<String, Vec<RawCountry>>;

#[derive(EnumIter, ToString, Copy, Clone, PartialEq, Serialize, Deserialize)]
pub enum Sort {
    Rank,
    RankRevered,
    Confirmed,
    ConfirmedRevered,
    Deaths,
    DeathsRevered,
    Recovered,
    RecoveredRevered,
    Changed,
    ChangedRevered
}

impl Component for App {
    type Message = Msg;
    type Properties = ();

    fn create(_: Self::Properties, link: ComponentLink<Self>) -> Self {
        let storage = StorageService::new(Area::Local).unwrap();

        let countries = Vec::new();
        let state = State {
            countries,
            sort: Sort::Rank,
            page: 1
        };
        let fetch_service = FetchService::new();
        App { fetch_service, link, storage, state, ft: None, }
    }

    fn mounted(&mut self) -> ShouldRender {
        self.fetch_json();

        true
    }
    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::SetPage(page) => {
                self.state.page = page;
            }
            Msg::SetSort(sort) => {
                self.state.sort = sort;
                self.state.sort();
            }
            Msg::FetchData => {
                self.fetch_json();
            }
            Msg::FetchReady(response) => {
                let data = response.ok();
                match data {
                    Some(d) => {
                        info!("{:?}", d);
                        let mut countries = Vec::new();
                        for (k, v) in &d {
                            let n = v.len();
                            let (rank, last_rank) = self.rank_country(k.as_str(), &d);
                            let rank_changed = last_rank - rank;
                            let country = Country {
                                name: k.to_string(),
                                rank,
                                last_rank,
                                rank_changed,
                                confirmed: v[n - 1].confirmed,
                                deaths: v[n - 1].deaths,
                                recovered: v[n - 1].recovered,
                            };
                            countries.insert(0, country);
                        }
                        self.state.countries = countries;
                        self.state.sort();
                    }
                    None => {
                        // do nothing
                    }
                }
            }
            Msg::Ignore => {
                return false;
            }
        }
        true
    }

    fn view(&self) -> Html {
        info!("rendered!");
        html! {
            <div class="todomvc-wrapper">
                <header class="header">
                    <h1>{ "Olymcovid19 ranking" }</h1>
                </header>
                <section class="rank-table">
                    <div class="rank-table-header">{ "Rank" } <span class="arrows down"></span></div>
                    <div class="rank-table-header">{ "Country" } <span class="arrows"></span></div>
                    <div class="rank-table-header">{ "Confirmed" } <span class="arrows"></span></div>
                    <div class="rank-table-header">{ "Deaths" } <span class="arrows"></span></div>
                    <div class="rank-table-header">{ "Recovered" } <span class="arrows"></span></div>
                    <div class="rank-table-header">{ "+/-" } <span class="arrows"></span></div>
                    <div class="rank-table-header">{ "Positions" }</div>

                    {
                        for self.state.countries.iter()
                            .enumerate()
                            .map(|val| self.view_country(val))
                    }
                </section>
                // <section class="rank-table-paginate">
                //     <ul class="pagination">
                //         <li class="paginate-button active"><a href="#">{"1"}</a></li>
                //         <li class="paginate-button"><a href="#">{"2"}</a></li>
                //         <li class="paginate-button"><a href="#">{"3"}</a></li>
                //         <li class="paginate-button"><a href="#">{"4"}</a></li>
                //         <li class="paginate-button"><a href="#">{"5"}</a></li>
                //     </ul>
                // </section>
                <footer class="info">
                    <p>{ "Written by " }<a href="https://github.com/yuyuvn/" target="_blank">{ "Clicia Scarlet" }</a></p>
                </footer>
            </div>
        }
    }
}


impl App {
    fn fetch_json(&mut self) {
        let callback = self.link.callback(
            move |response: Response<Json<Result<RawCountryData, Error>>>| {
                let (meta, Json(data)) = response.into_parts();
                println!("META: {:?}, {:?}", meta, data);
                if meta.status.is_success() {
                    Msg::FetchReady(data)
                } else {
                    error!("Error: {:?}", data);
                    Msg::Ignore
                }
            },
        );
        let request = Request::get(API_ENDPOINT).body(Nothing).unwrap();
        let task = self.fetch_service.fetch(request, callback).unwrap();
        self.ft = Some(task);
    }

    fn rank_country(&mut self, country: &str, data: &RawCountryData) -> (isize, isize) {
        let mut rank_today = 1;
        let mut rank_yesterday = 1;
        let country_len = data[country].len();
        let today_data = data[country][country_len - 1];
        let yesterday_data = data[country][country_len - 2];
        for (_, v) in data {
            let len = v.len();
            if v[len-1].confirmed > today_data.confirmed {
                rank_today += 1;
            }
            if v[len-2].confirmed > yesterday_data.confirmed {
                rank_yesterday += 1;
            }
        }
        return (rank_today, rank_yesterday)
    }

    fn view_country(&self, (_, entry): (usize, &Country)) -> Html {
        html! {
            <>
                <div class="rank-table-data">{ entry.rank }</div>
                <div class="rank-table-data rank-table-data-country"><img alt={ entry.name.as_str() } src={ helpers::get_country_code(entry.name.as_str()) } /> { entry.name.as_str() }</div>
                <div class="rank-table-data">{ entry.confirmed }</div>
                <div class="rank-table-data">{ entry.deaths }</div>
                <div class="rank-table-data">{ entry.recovered }</div>
                <div class="rank-table-data">{ entry.rank_changed } </div>
                <div class="rank-table-data">{ self.view_diff(entry.rank_changed) }</div>
            </>
        }
    }

    fn view_diff(&self, diff: isize) -> Html {
        if diff > 0 {
            html! {
                <span class="arrows up"></span>
            }
        } else if diff == 0 {
            html! {
                <span class="arrows"></span>
            }
        } else {
            html! {
                <span class="arrows down"></span>
            }
        }
    }
}

impl<'a> Into<Href> for &'a Sort {
    fn into(self) -> Href {
        match *self {
            Sort::Rank => "#/".into(),
            Sort::RankRevered => "#/rr".into(),
            Sort::Confirmed => "#/c".into(),
            Sort::ConfirmedRevered => "#/cr".into(),
            Sort::Deaths => "#/d".into(),
            Sort::DeathsRevered => "#/dr".into(),
            Sort::Recovered => "#/e".into(),
            Sort::RecoveredRevered => "#/er".into(),
            Sort::Changed => "#/c".into(),
            Sort::ChangedRevered => "#/cr".into(),
        }
    }
}

impl Sort {

}

impl State {
    fn sort(&mut self) {
        match self.sort {
            Sort::Rank => self.countries.sort_by(|a, b| a.rank.partial_cmp(&b.rank).unwrap()),
            Sort::RankRevered => self.countries.sort_by(|a, b| b.rank.partial_cmp(&a.rank).unwrap()),
            Sort::Confirmed => self.countries.sort_by(|a, b| a.confirmed.partial_cmp(&b.confirmed).unwrap()),
            Sort::ConfirmedRevered => self.countries.sort_by(|a, b| b.confirmed.partial_cmp(&a.confirmed).unwrap()),
            Sort::Deaths => self.countries.sort_by(|a, b| a.deaths.partial_cmp(&b.deaths).unwrap()),
            Sort::DeathsRevered => self.countries.sort_by(|a, b| b.deaths.partial_cmp(&a.deaths).unwrap()),
            Sort::Recovered => self.countries.sort_by(|a, b| a.recovered.partial_cmp(&b.recovered).unwrap()),
            Sort::RecoveredRevered => self.countries.sort_by(|a, b| b.recovered.partial_cmp(&a.recovered).unwrap()),
            Sort::Changed => self.countries.sort_by(|a, b| a.rank_changed.partial_cmp(&b.rank_changed).unwrap()),
            Sort::ChangedRevered => self.countries.sort_by(|a, b| b.rank_changed.partial_cmp(&a.rank_changed).unwrap()),
        }
    }
}
