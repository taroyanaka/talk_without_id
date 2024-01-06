// https://marketplace.visualstudio.com/items?itemName=emeraldwalk.RunOnSave

// in vscode's workspace settings.json
// {
// "emeraldwalk.runonsave": {
//     "commands": [
//         {
//             "match": "/Users/yanakataro/Desktop/js2/q_a/CRUD_endpoint_sql_for_index.js",
//             "cmd": "cp /Users/yanakataro/Desktop/js2/q_a/CRUD_endpoint_sql_for_index.js /Users/yanakataro/Desktop/npm_package/CRUD_endpoint_sql_for_index.js"
//         }
//     ]
// }
// }

// on CLI
// nodemon /Users/yanakataro/Desktop/npm_package/CRUD_endpoint_sql_for_index.js






// CRUD_endpoint_sql_for_index.js
// node.js, express.js and better-sqlite3.js validator.js cors.js


// npm install express better-sqlite3 validator cors
// touch ./q_a.sqlite3
// sqlite3 ./q_a.sqlite3 < ./sql_init_for_index.sql
// node ./CRUD_endpoint_sql_for_index.js


//  ユーザーのテーブル。カラムはIDはと名前とパスワードと作成日と更新日を持つ。IDは自動的に増加する
// CREATE TABLE users (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   name TEXT NOT NULL,
//   password TEXT NOT NULL,
//   created_at DATETIME NOT NULL,
//   updated_at DATETIME NOT NULL
// );

//  q_aというブログのようなサービスのテーブル。contentと作成日と更新日を持つ。IDは自動的に増加する。usersのIDを外部キーとして持つ
// CREATE TABLE q_a (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   user_id INTEGER NOT NULL,
//   content TEXT NOT NULL,
//   created_at DATETIME NOT NULL,
//   updated_at DATETIME NOT NULL,
//   FOREIGN KEY (user_id) REFERENCES users(id)
// );

//  f_i_bというブログのようなサービスのテーブル。contentと作成日と更新日を持つ。IDは自動的に増加する。usersのIDを外部キーとして持つ
// CREATE TABLE f_i_b (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   user_id INTEGER NOT NULL,
//   content TEXT NOT NULL,
//   created_at DATETIME NOT NULL,
//   updated_at DATETIME NOT NULL,
//   FOREIGN KEY (user_id) REFERENCES users(id)
// );
//  i_t_nというブログのようなサービスのテーブル。contentと作成日と更新日を持つ。IDは自動的に増加する。usersのIDを外部キーとして持つ
// CREATE TABLE i_t_n (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   user_id INTEGER NOT NULL,
//   content TEXT NOT NULL,
//   created_at DATETIME NOT NULL,
//   updated_at DATETIME NOT NULL,
//   FOREIGN KEY (user_id) REFERENCES users(id)
// );



const express = require('express');


// better-sqlite3のサンプル
const sqlite = require('better-sqlite3');
const db = new sqlite('q_a.sqlite3');

const app = express();

// corsで全てのアクセスを許可する
const cors = require('cors');
app.use(cors());


const port = 8000;
// expressをlocalhostで起動する
// app.listen(port, 'localhost', () => {
app.listen(port, "0.0.0.0", () => {
// app.listen(port, '127.0.0.1', () => {
    console.log(`App listening at http://localhost:${port}`);
});

// '/read_q_a'というGETのリクエストを受け取るエンドポイントで、q_aの全てのidとcontentとcreated_atとupdated_atとuserのnameを返す
app.get('/read_q_a', (req, res) => {
    const read_q_a = db.prepare('SELECT q_a.id, q_a.content, q_a.created_at, q_a.updated_at, users.name FROM q_a INNER JOIN users ON q_a.user_id = users.id').all();
    res.send(read_q_a);
});

// '/insert_q_a'というPOSTのリクエストを受け取るエンドポイントで、nameとpasswordを受け取り、nameとpasswordが一致する場合はそのユーザーのcontentとそのcontentのidとcreated_atとupdated_atを返す。sqlクエリの回数は2回までにする
app.post('/insert_q_a', (req, res) => {
    const now = new Date().toISOString();
    const [name, password, content] = [req.body.name, req.body.password, req.body.content];
    const user = db.prepare('SELECT * FROM users WHERE name = ? AND password = ?').get(name, password);
    if (user) {
        const insert_q_a = db.prepare('INSERT INTO q_a (user_id, content, created_at, updated_at) VALUES (?, ?, ?, ?)').run(user.id, content, now, now);
        res.send(insert_q_a);
    } else {
        res.send('ユーザーが存在しません');
    }
});

// '/delete_q_a'というPOSTのリクエストを受け取るエンドポイントで、nameとpasswordを受け取り、nameとpasswordが一致する場合は、idを受け取り、そのidのq_aを削除する
app.post('/delete_q_a', (req, res) => {
    const now = new Date().toISOString();
    const [name, password, content] = [req.body.name, req.body.password, req.body.content];
    const user = db.prepare('SELECT * FROM users WHERE name = ? AND password = ?').get(name, password);
    if (user) {
        const delete_q_a = db.prepare('DELETE FROM q_a WHERE id = ?').run(content);
        res.send(delete_q_a);
    } else {
        res.send('ユーザーが存在しません');
    }
});


// '/read_i_t_n'
// '/insert_i_t_n'
// '/delete_i_t_n'
