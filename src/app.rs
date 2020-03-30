use log::*;
use serde_derive::{Deserialize, Serialize};
// use strum::IntoEnumIterator;
use strum_macros::{EnumIter, ToString};
// use yew::format::Json;
use yew::services::storage::{Area, StorageService};
use yew::prelude::*;

pub struct App {
    link: ComponentLink<Self>,
    storage: StorageService,
    state: State,
}

#[derive(Serialize, Deserialize)]
pub struct State {
    countries: Vec<Country>,
    sort: Sort,
    page: usize
}

#[derive(Serialize, Deserialize)]
pub struct Country {
    rank: usize,
    last_rank: usize,
    confirmed: usize,
    deaths: usize,
    recovered: usize
}

pub enum Msg {
    SetSort(Sort),
    SetPage(usize)
}

#[derive(EnumIter, ToString, Clone, PartialEq, Serialize, Deserialize)]
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
            page: 1,
        };
        App { link, storage, state }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::SetPage(page) => {
                self.state.page = page;
            }
            Msg::SetSort(sort) => {
                self.state.sort = sort;
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

                    <div class="rank-table-data">{ "1" }</div>
                    <div class="rank-table-data rank-table-data-country"><img alt="USA" src="https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/us.svg" /> {"United States"}</div>
                    <div class="rank-table-data">{"142,537"}</div>
                    <div class="rank-table-data">{"2,510"}</div>
                    <div class="rank-table-data">{"4,767"}</div>
                    <div class="rank-table-data">{"0 "}</div>
                    <div class="rank-table-data"><span class="arrows"></span></div>

                    <div class="rank-table-data">{"2"}</div>
                    <div class="rank-table-data rank-table-data-country"><img alt="Italia" src="https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/it.svg" /> {"Italy"}</div>
                    <div class="rank-table-data">{"97,689"}</div>
                    <div class="rank-table-data">{"10,779"}</div>
                    <div class="rank-table-data">{"13,030"}</div>
                    <div class="rank-table-data">{"1 "}</div>
                    <div class="rank-table-data"><span class="arrows up"></span></div>

                    <div class="rank-table-data">{"3"}</div>
                    <div class="rank-table-data rank-table-data-country"><img alt="China" src="https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/cn.svg" /> {"China"}</div>
                    <div class="rank-table-data">{"81,470"}</div>
                    <div class="rank-table-data">{"3,304"}</div>
                    <div class="rank-table-data">{"75,770"}</div>
                    <div class="rank-table-data">{"-1 "}</div>
                    <div class="rank-table-data"><span class="arrows down"></span></div>
                </section>
                <section class="rank-table-paginate">
                    <ul class="pagination">
                        <li class="paginate-button active"><a href="#">{"1"}</a></li>
                        <li class="paginate-button"><a href="#">{"2"}</a></li>
                        <li class="paginate-button"><a href="#">{"3"}</a></li>
                        <li class="paginate-button"><a href="#">{"4"}</a></li>
                        <li class="paginate-button"><a href="#">{"5"}</a></li>
                    </ul>
                </section>
                <footer class="info">
                    <p>{ "Written by " }<a href="https://github.com/yuyuvn/" target="_blank">{ "Clicia Scarlet" }</a></p>
                </footer>
            </div>
        }
    }
}


impl App {

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

}
