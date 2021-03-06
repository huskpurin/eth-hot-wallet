const express = require('express');
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');
const config = require('./config');
const routes = require('./routes/index');

const app = express();
const port = config.get('port');
const isProduction = process.env.NODE_ENV === 'production';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (!isProduction) {
  app.use(errorhandler());
}

app.use(routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res, next) => {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      },
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

app.listen(port, err => {
  if (err) {
    console.error(err);
  }

  console.info(`----\n==> App is running on port ${port}`);
});
