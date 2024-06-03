import "./App.css";

import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState, useEffect } from "react";

function App() {
  const [birthdays, setBirthdays] = useState([]);
  const [selectedBirthday, setSelectedBirthday] = useState(null);
  const [loadings, setLoadings] = useState(false);
  const [favorites, setFavorites] = useState([]);

  async function fetchData() {
    if (!selectedBirthday) {
      console.error("No date selected");
      return;
    }

    let month = selectedBirthday.getMonth() + 1;
    let day = selectedBirthday.getDate();

    let url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`;

    try {
      setLoadings(true);
      let response = await fetch(url, {
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzMzhmODM5ODRhZDI0NjRlNmI1NDc3NDcwMjAyMjdhNiIsImp0aSI6Ijc2NDZjMjE5ZjU3NmJkNDcwYjMwMTI0YWFmMjA2OTNiYTE1YjA4NmE0OWFkOGVhMDJiYWNmMGVhYjJmMjhmM2MxMjc2YmEyYzM5YzFjNGZmIiwiaWF0IjoxNzE3NDQwMjEzLjYzNTQxOSwibmJmIjoxNzE3NDQwMjEzLjYzNTQyMywiZXhwIjozMzI3NDM0OTAxMy42MzMxNzUsInN1YiI6Ijc1Nzk5ODgwIiwiaXNzIjoiaHR0cHM6Ly9tZXRhLndpa2ltZWRpYS5vcmciLCJyYXRlbGltaXQiOnsicmVxdWVzdHNfcGVyX3VuaXQiOjUwMDAsInVuaXQiOiJIT1VSIn0sInNjb3BlcyI6WyJiYXNpYyJdfQ.c-3soL8jM2akxCxUH3TCje7Mtm1nCntwYDHSPc4kKIHFQbl0IMzXr4QeUl_VzrcjCl20XRAH2NDXQp0ZvVp8Un6CW7ULi-2LJeuwGMgb5SIrDGPPlBSPgBG1Iu7tP7jAIHtw_M100LP0733eEXEKjoWh01nja0J5t7xgklo6f6ooku9ldAq2Y19ZBWcfhHovzbJDiw_bW-xm9M0AtVdYbijbHwlaiqip6EaCG7_0BghK0KlRfuLV5Creg4XQBWGjNqLvwWHAoll_jYVtbgexIjegLtem73JiYPpduUi-5cG670HzYh75Ohs9rFi9ShE1gXPb-TwogJ4VWbN2E_k_IRI6K0xa6bWLisSjpiiamGQlBi8HTVacsPHO24d89bHK8gbQNERCfTgj-VeTiQnRIIuP2kfscHU4iZ9HYPzBaw1UYpfjEd8sgciTSxgvpEJVTcq4lorOUuaIiNGlbSbEyOBoWscB62eG8IthV4iMqLqBJ4ag3Qhxrfv2kGfl3lpK7K3LDRSZGlo59UncuGbr53lzZDsveELJSAPV2sQN2uYEKJK32MYq4XtfbY_zYvhxfwSL8LVeFGnu7pJPk_pcthUeugXmy_IbegI23tMECiQdv3BusHSeyiXMHRCx4PW7Ead7FV4PPaEvxfSen-38X1BuwXfjP6JdpRH31qzG99I",
          "Api-User-Agent": "datePicker",
        },
      });
      let data = await response.json();
      console.log(data.births);
      setLoadings(false);
      setBirthdays(data.births);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [selectedBirthday]);

  const handleDateChange = (date) => {
    setSelectedBirthday(new Date(date));
  };

  const toggleFavorite = (birthday) => {
    if (favorites.includes(birthday)) {
      setFavorites(favorites.filter((item) => item !== birthday));
    } else {
      setFavorites([...favorites, birthday]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>This Is Birthday Selector</h1>
        <p>
          Please select a date below and star the birthday to make the birthday
          your favourite.
        </p>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Please select a date"
              onChange={handleDateChange}
            />
          </DemoContainer>
        </LocalizationProvider>


        {favorites.length > 0 ? <h2>Yours Favourite Birthdays</h2> : <div></div>}
        {favorites.map((item) => (
          <div key={item} style={{ display: "flex", gap: "18px" }}>
            <div style={{ fontWeight: "600", color: "red" }}>
              {item.pages[1].title.replace("_", " ")}{" "}
            </div>
            <div key={item.text}>{item.text}</div>
          </div>
        ))}

        {loadings ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h2>Birthdays for Today</h2>
            {birthdays.map(
              (birthday) =>
                birthday.pages.length === 2 && (
                  <div style={{ display: "flex" }}>
                    <input
                      key={birthday.text}
                      type="checkbox"
                      id={birthday.text}
                      name={birthday.text}
                      onChange={() => toggleFavorite(birthday)}
                      checked={favorites.includes(birthday)}
                    />

                    <div>
                      <div key={birthday.text}>{birthday.text}</div>
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
