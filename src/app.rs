use log::*;
use serde_derive::{Deserialize, Serialize};
// use strum::IntoEnumIterator;
use strum_macros::{EnumIter, ToString};
use yew::format::Json;
use yew::services::storage::{Area, StorageService};
use yew::prelude::*;

const KEY: &str = "yew.todomvc.self";

pub struct App {
    link: ComponentLink<Self>,
    storage: StorageService,
    state: State,
}

#[derive(Serialize, Deserialize)]
pub struct State {
    entries: Vec<Entry>,
    filter: Filter,
    value: String,
    edit_value: String,
}

#[derive(Serialize, Deserialize)]
struct Entry {
    description: String,
    completed: bool,
    editing: bool,
}

pub enum Msg {
    Add,
    Edit(usize),
    Update(String),
    UpdateEdit(String),
    Remove(usize),
    SetFilter(Filter),
    ToggleAll,
    ToggleEdit(usize),
    Toggle(usize),
    ClearCompleted,
    Nope,
}

impl Component for App {
    type Message = Msg;
    type Properties = ();

    fn create(_: Self::Properties, link: ComponentLink<Self>) -> Self {
        let storage = StorageService::new(Area::Local).unwrap();
        let entries = {
            if let Json(Ok(restored_entries)) = storage.restore(KEY) {
                restored_entries
            } else {
                Vec::new()
            }
        };
        let state = State {
            entries,
            filter: Filter::All,
            value: "".into(),
            edit_value: "".into(),
        };
        App { link, storage, state }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::Add => {
                let entry = Entry {
                    description: self.state.value.clone(),
                    completed: false,
                    editing: false,
                };
                self.state.entries.push(entry);
                self.state.value = "".to_string();
            }
            Msg::Edit(idx) => {
                let edit_value = self.state.edit_value.clone();
                self.state.complete_edit(idx, edit_value);
                self.state.edit_value = "".to_string();
            }
            Msg::Update(val) => {
                println!("Input: {}", val);
                self.state.value = val;
            }
            Msg::UpdateEdit(val) => {
                println!("Input: {}", val);
                self.state.edit_value = val;
            }
            Msg::Remove(idx) => {
                self.state.remove(idx);
            }
            Msg::SetFilter(filter) => {
                self.state.filter = filter;
            }
            Msg::ToggleEdit(idx) => {
                self.state.edit_value = self.state.entries[idx].description.clone();
                self.state.toggle_edit(idx);
            }
            Msg::ToggleAll => {
                let status = !self.state.is_all_completed();
                self.state.toggle_all(status);
            }
            Msg::Toggle(idx) => {
                self.state.toggle(idx);
            }
            Msg::ClearCompleted => {
                self.state.clear_completed();
            }
            Msg::Nope => {}
        }
        self.storage.store(KEY, Json(&self.state.entries));
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
    fn view_filter(&self, filter: Filter) -> Html {
        let flt = filter.clone();

        html! {
            <li>
                <a class=if self.state.filter == flt { "selected" } else { "not-selected" }
                   href=&flt
                   onclick=self.link.callback(move |_| Msg::SetFilter(flt.clone()))>
                    { filter }
                </a>
            </li>
        }
    }

    fn view_input(&self) -> Html {
        html! {
            // You can use standard Rust comments. One line:
            // <li></li>
            <input class="new-todo"
                   placeholder="What needs to be done?"
                   value=&self.state.value
                   oninput=self.link.callback(|e: InputData| Msg::Update(e.value))
                   onkeypress=self.link.callback(|e: KeyboardEvent| {
                       if e.key() == "Enter" { Msg::Add } else { Msg::Nope }
                   }) />
            /* Or multiline:
            <ul>
                <li></li>
            </ul>
            */
        }
    }

    fn view_entry(&self, (idx, entry): (usize, &Entry)) -> Html {
        let mut class = "todo".to_string();
        if entry.editing {
            class.push_str(" editing");
        }
        if entry.completed {
            class.push_str(" completed");
        }

        html! {
            <li class=class>
                <div class="view">
                    <input class="toggle" type="checkbox" checked=entry.completed onclick=self.link.callback(move |_| Msg::Toggle(idx)) />
                    <label ondoubleclick=self.link.callback(move |_| Msg::ToggleEdit(idx))>{ &entry.description }</label>
                    <button class="destroy" onclick=self.link.callback(move |_| Msg::Remove(idx)) />
                </div>
                { self.view_entry_edit_input((&idx, &entry)) }
            </li>
        }
    }

    fn view_entry_edit_input(&self, (idx, entry): (&usize, &Entry)) -> Html {
        let idx = *idx;
        if entry.editing {
            html! {
                <input class="edit"
                       type="text"
                       value=&entry.description
                       oninput=self.link.callback(move |e: InputData| Msg::UpdateEdit(e.value))
                       onblur=self.link.callback(move |_| Msg::Edit(idx))
                       onkeypress=self.link.callback(move |e: KeyboardEvent| {
                          if e.key() == "Enter" { Msg::Edit(idx) } else { Msg::Nope }
                       }) />
            }
        } else {
            html! { <input type="hidden" /> }
        }
    }
}



#[derive(EnumIter, ToString, Clone, PartialEq, Serialize, Deserialize)]
pub enum Filter {
    All,
    Active,
    Completed,
}

impl<'a> Into<Href> for &'a Filter {
    fn into(self) -> Href {
        match *self {
            Filter::All => "#/".into(),
            Filter::Active => "#/active".into(),
            Filter::Completed => "#/completed".into(),
        }
    }
}

impl Filter {
    fn fit(&self, entry: &Entry) -> bool {
        match *self {
            Filter::All => true,
            Filter::Active => !entry.completed,
            Filter::Completed => entry.completed,
        }
    }
}

impl State {
    fn total(&self) -> usize {
        self.entries.len()
    }

    fn total_completed(&self) -> usize {
        self.entries
            .iter()
            .filter(|e| Filter::Completed.fit(e))
            .count()
    }

    fn is_all_completed(&self) -> bool {
        let mut filtered_iter = self
            .entries
            .iter()
            .filter(|e| self.filter.fit(e))
            .peekable();

        if filtered_iter.peek().is_none() {
            return false;
        }

        filtered_iter.all(|e| e.completed)
    }

    fn toggle_all(&mut self, value: bool) {
        for entry in self.entries.iter_mut() {
            if self.filter.fit(entry) {
                entry.completed = value;
            }
        }
    }

    fn clear_completed(&mut self) {
        let entries = self
            .entries
            .drain(..)
            .filter(|e| Filter::Active.fit(e))
            .collect();
        self.entries = entries;
    }

    fn toggle(&mut self, idx: usize) {
        let filter = self.filter.clone();
        let mut entries = self
            .entries
            .iter_mut()
            .filter(|e| filter.fit(e))
            .collect::<Vec<_>>();
        let entry = entries.get_mut(idx).unwrap();
        entry.completed = !entry.completed;
    }

    fn toggle_edit(&mut self, idx: usize) {
        let filter = self.filter.clone();
        let mut entries = self
            .entries
            .iter_mut()
            .filter(|e| filter.fit(e))
            .collect::<Vec<_>>();
        let entry = entries.get_mut(idx).unwrap();
        entry.editing = !entry.editing;
    }

    fn complete_edit(&mut self, idx: usize, val: String) {
        let filter = self.filter.clone();
        let mut entries = self
            .entries
            .iter_mut()
            .filter(|e| filter.fit(e))
            .collect::<Vec<_>>();
        let entry = entries.get_mut(idx).unwrap();
        entry.description = val;
        entry.editing = !entry.editing;
    }

    fn remove(&mut self, idx: usize) {
        let idx = {
            let filter = self.filter.clone();
            let entries = self
                .entries
                .iter()
                .enumerate()
                .filter(|&(_, e)| filter.fit(e))
                .collect::<Vec<_>>();
            let &(idx, _) = entries.get(idx).unwrap();
            idx
        };
        self.entries.remove(idx);
    }
}
