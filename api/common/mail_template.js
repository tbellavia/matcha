function HTML_TEMPLATE(headerText, bodyText) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>NodeMailer Email Template</title>
        <style>
          .container {
            width: 100%;
            height: 100%;
            padding: 20px;
            background-color: #EDF2F4;
          }
          .email {
            width: 80%;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
          }
          .email-header {
            background-color: #EE8B98;
            color: #EEE6E9;
            padding: 20px;
            text-align: center;
          }
          .email-body {
            padding: 20px;
          }
          .email-footer {
            background-color: #EE8B98;
            color: #EEE6E9;
            padding: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email">
            <div class="email-header">
              <h1>${headerText}</h1>
            </div>
            <div class="email-body">
              <p>${bodyText}</p>
            </div>
            <div class="email-footer">
              <p>mail envoyer depuis l'api matcha</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function HTML_TEMPLATE_REPORT(user1, user2) {
    const stringReport = `${user1.first_name} ${user1.last_name} (user_id:${user1.id_user}) a signalé : <br/>${user2.first_name} ${user2.last_name} (user_id:${user2.id_user}) contact : ${user2.mail}`;
    return HTML_TEMPLATE("Un utilisateur a signalé un profile", stringReport);
}


module.exports = { HTML_TEMPLATE_REPORT };