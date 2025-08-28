const Joi = require("joi");
const dateFormat = require("dateformat");
const { db_Select, db_Insert } = require("../../model/Master.model");

const shift = async (req, res) => {
    try {
        var custId = req.session.user.user_data.customer_id;
        var select = "a.*,b.customer_id,b.customer_name",
          table_name = "md_shift a, md_customer b",
          where = `a.customer_id = b.customer_id AND a.customer_id=${custId}`;
        var shift = await db_Select(select, table_name, where, null);
        // console.log(shift);
        const page_data = {
          title: "Shift details",
          page_path: "/shift/shift",
          data: shift,
        };
        res.render("common/layouts/main", page_data);
      } catch (error) {
        res.redirect("/login");
      }
};

const save_add_shift = async (req, res) => {
    try {
      const schema = Joi.object({
        cust_id: Joi.optional(),
        shift_name: Joi.required(),
        frm_time: Joi.required(),
        to_time: Joi.required(),
      });
      const { error, value } = schema.validate(req.body, { abortEarly: false });
    //   console.log(value);
      if (error) {
        const errors = {};
        error.details.forEach((detail) => {
          errors[detail.context.key] = detail.message;
        });
        return res.json({ error: errors });
      }
  
      const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var custId = req.session.user.user_data.customer_id;
  
      // console.log(value);
      let fields =
          "(customer_id,shift_name,f_time,t_time,created_at)",
        values = `('${custId}','${value.shift_name}','${value.frm_time}','${value.to_time}','${datetime}')`;
      let res_dt = await db_Insert("md_shift", fields, values, null, 0);
    //   console.log("========shift==========", res_dt);
      req.flash("success", "Saved successful");
      res.redirect("/shift/shift_details");
      // res.send(res_dt)
    } catch (error) {
      // console.log(error);
      req.flash("error", "Data not saved Successfully");
      res.redirect("/shift/shift_details");
    }
  };

  const edit_shift = async (req, res) => {
    var data = req.query;
    // console.log(data,'123');
    var custId = req.session.user.user_data.customer_id;
    let select = "a.*,b.customer_id,b.customer_name",
      table_name = "md_shift a, md_customer b",
      whr = `a.customer_id = b.customer_id AND a.customer_id='${custId}' AND a.shift_name='${data.shift_name}'`;
    const resData = await db_Select(select, table_name, whr, null);
    // console.log(resData);
    delete resData.sql;
    var viewData = {
      title: "Shift",
      page_path: "/shift/edit_shift",
      data: resData.suc > 0 && resData.msg.length > 0 ? resData.msg[0] : [],
      customer_id: custId,
    };
    console.log(viewData,'12345');
    res.render("common/layouts/main", viewData);
  };

  const save_edit_shift = async (req, res) => {
    try {
      const schema = Joi.object({
        cust_id: Joi.string(),
        shift_name: Joi.optional(),
        frm_time: Joi.optional(),
        to_time: Joi.optional(),
      });
      const { error, value } = schema.validate(req.body, { abortEarly: false });
      console.log(value);
      if (error) {
        const errors = {};
        error.details.forEach((detail) => {
          errors[detail.context.key] = detail.message;
        });
        return res.json({ error: errors });
      }
  
      var custId = req.session.user.user_data.customer_id;
      const datetime = dateFormat(new Date(), "yyyy-mm-dd");
  
      let fields = `shift_name='${value.shift_name}',f_time='${value.frm_time}',t_time='${value.to_time}',updated_at='${datetime}'`,
        where = `customer_id='${custId}' AND shift_name='${value.shift_name}'`;
      let res_dt2 = await db_Insert("md_shift", fields, null, where, 1);
      console.log(res_dt2);
      req.flash("success", "Updated successful");
      res.redirect("/shift/shift_details");
    } catch (error) {
      console.log(error);
      req.flash("error", "Data not Updated Successfully");
      res.redirect("/shift/shift_details");
    }
  };

module.exports = {shift,save_add_shift,edit_shift,save_edit_shift}