const db = require("../config/Db.config");

const db_Select = (select, table_name, whr, order) => {
    var tb_whr = whr ? `WHERE ${whr}` : "";
    var tb_order = order ? order : "";
    let sql = `SELECT ${select} FROM ${table_name} ${tb_whr} ${tb_order}`;
    // console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err), sql };
            } else {
                data = { suc: 1, msg: result, sql };
            }
            resolve(data);
        });
    });
};

const db_Insert = (table_name, fields, values, whr, flag) => {
    var sql = "",
        msg = "",
        tb_whr = whr ? `WHERE ${whr}` : "";
    // 0 -> INSERT; 1 -> UPDATE
    // IN INSERT flieds ARE TABLE COLOUMN NAME ONLY || IN UPDATE fields ARE TABLE NAME = VALUES
    if (flag > 0) {
        sql = `UPDATE ${table_name} SET ${fields} ${tb_whr}`;
        msg = "Updated Successfully !!";

        console.log(sql);
    } else {
        sql = `INSERT INTO ${table_name} ${fields} VALUES ${values}`;
        msg = "Inserted Successfully !!";
    }
    // console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err), lastId: 0 };
            } else {
                data = { suc: 1, msg: msg, lastId };
            }
            resolve(data);
        });
    });
};

const db_Delete = (table_name, whr) => {
    whr = whr ? `WHERE ${whr}` : "";
    var sql = `DELETE FROM ${table_name} ${whr}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: "Deleted Successfully !!" };
            }
            resolve(data);
        });
    });
};

const db_Check = async (fields, table_name, whr) => {
    var sql = `SELECT ${fields} FROM ${table_name} WHERE ${whr}`;
    // console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: result.length };
            }
            resolve(data);
        });
    });
};
const db_Select_Sqery = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: result, sql };
            }
            resolve(data);
        });
    });
};


module.exports = { db_Select, db_Insert, db_Delete, db_Check, db_Select_Sqery }