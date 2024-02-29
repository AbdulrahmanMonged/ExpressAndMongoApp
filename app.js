const db = require("./db");
const express = require("express");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();
const port = 3000;
const categories = ["vegetables", "fruit", "dairy"];

db.connectToDb().catch((err) => console.log(err));

app.use(methodOverride("_m"));
app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.get("/", async (req, res) => {
  res.render("index.html");
});

app.all("/products", async (req, res) => {
  switch (req.method) {
    case "POST": {
      const { productName, productPrice, category } = req.body;
      const newProduct = new db.Product({
        name: productName,
        price: productPrice,
        category: category,
      });
      await newProduct.save();
      res.redirect(`/product/${newProduct._id}`);
      break;
    }
    case "GET": {
      const products = await db.Product.find({}).exec();
      res.render("products.html", { products });
      break;
    }
  }
});

app.all("/product/:id", async (req, res) => {
  const { id } = req.params;
  const product = await db.Product.findById(id).exec();
  switch (req.method) {
    case "GET": {
      res.render("product.html", { product });
      break;
    }
    case "PATCH": {
      const { productName, productPrice, category } = req.body;
      product.name = productName;
      product.price = productPrice;
      product.category = category;
      await product.save();
      res.redirect(`/product/${product._id}`);
      break;
    }
    case "DELETE": {
      await db.Product.findByIdAndDelete(id).exec();
      res.redirect(`/products/`);
    }
  }
});

app.get("/products/new", async (req, res) => {
  res.render("makeProduct.html");
});

app.get("/product/:id/update", async (req, res) => {
  const { id } = req.params;
  const product = await db.Product.findById(id).exec();
  res.render("updateProduct.html", { product, categories });
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
