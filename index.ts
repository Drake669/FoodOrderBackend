import express from "express";
import path from "path"

import {AdminRoutes, VendorRoutes } from "./routes"
import bodyParser from "body-parser";
import mongoose, { ConnectOptions } from "mongoose";
import { CONNECTION_URL } from "./config";

const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use("/images", express.static(path.join(__dirname, "images")))

app.use("/admin", AdminRoutes)
app.use("/vendor", VendorRoutes)


mongoose.connect(CONNECTION_URL)
  .then(result => {
    console.log("Databse connected succesfully")
  })
  .catch(error => {
    console.log(error)
  })


app.listen(8000, () => {
    console.clear()
    console.log("App running on port 8000")
})