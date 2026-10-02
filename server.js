const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kamen_rider_db",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }

  console.log("Connected to MySQL");
});

app.get("/api/series", (req, res) => {
  const sql = "SELECT * FROM series";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);

      return res.status(500).json({
        message: "Failed to load series",
      });
    }

    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



app.post("/api/series", (req, res) => {
  const {
    title,
    startYear,
    endYear,
    era,
    episodesReleased,
    theme,
    status,
    watchedEpisode,
  } = req.body;

  const sql = `
        INSERT INTO series
        (title, start_year, end_year, era, episodes_released, theme, status, watched_episode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(
    sql,
    [
      title,
      startYear,
      endYear,
      era,
      episodesReleased,
      theme,
      status,
      watchedEpisode,
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to add series",
        });
      }

      res.status(201).json({
        message: "Series added successfully",
        id: result.insertId,
      });
    },
  );
});

app.put("/api/series/:id", (req, res) => {

    const id = Number(req.params.id);

    const {
        title,
        startYear,
        endYear,
        era,
        episodesReleased,
        theme,
        status,
        watchedEpisode
    } = req.body;

    const sql = `
        UPDATE series
        SET
            title = ?,
            start_year = ?,
            end_year = ?,
            era = ?,
            episodes_released = ?,
            theme = ?,
            status = ?,
            watched_episode = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            title,
            startYear,
            endYear,
            era,
            episodesReleased,
            theme,
            status,
            watchedEpisode,
            id
        ],
        (err, result) => {

            if (err) {
                console.error("Database error:", err);

                return res.status(500).json({
                    message: "Failed to update series"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Series not found"
                });
            }

            res.json({
                message: "Series updated successfully"
            });
        }
    );
});

app.delete("/api/series/:id", (req, res) => {

    const id =
        Number(req.params.id);


    const sql =
        "DELETE FROM series WHERE id = ?";


    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                console.error(
                    "Database error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to delete series"
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        "Series not found"
                });

            }


            res.json({
                message:
                    "Series deleted successfully"
            });

        }
    );

});