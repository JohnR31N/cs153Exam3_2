const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;


app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  const html = `
    <html>
      <head>
        <title>Meal Finder</title>
        <style>
          body {
            font-family: sans-serif;
            padding: 20px;
          }
          h1 {
            font-size: 32px;
          }
          form {
            margin-bottom: 20px;
          }
          .card {
            background-color: #fdd4a3;
            border: 2px solid black;
            padding: 10px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .card img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 4px;
          }
          .name {
            font-size: 18px;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <h1>Meal Finder</h1>
        <form method="POST" action="/meals">
          <label>Main Ingredient:</label>
          <input name="ingredient" placeholder="e.g. beef" />
          <button type="submit">Search</button>
        </form>
      </body>
    </html>
  `;
  res.send(html);
});

// POST 后查询食材
app.post('/meals', async (req, res) => {
  const ingredient = req.body.ingredient || 'chicken_breast';
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;

  try {
    const response = await axios.get(url);
    const meals = response.data.meals || [];

    let html = `
      <html>
        <head>
          <title>Meal Finder</title>
          <style>
            body {
              font-family: sans-serif;
              padding: 20px;
            }
            h1 {
              font-size: 32px;
            }
            form {
              margin-bottom: 20px;
            }
            .card {
              background-color: #fdd4a3;
              border: 2px solid black;
              padding: 10px;
              margin-bottom: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .card img {
              width: 100px;
              height: 100px;
              object-fit: cover;
              border-radius: 4px;
            }
            .name {
              font-size: 18px;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <h1>Meal Finder</h1>
          <form method="POST" action="/meals">
            <label>Main Ingredient:</label>
            <input name="ingredient" value="${ingredient}" />
            <button type="submit">Search</button>
          </form>
    `;

    for (const meal of meals) {
      html += `
        <div class="card">
          <div class="name">${meal.strMeal}</div>
          <img src="${meal.strMealThumb}" />
        </div>
      `;
    }

    html += `</body></html>`;
    res.send(html);
  } catch (err) {
    res.status(500).send('API error');
  }
});

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
