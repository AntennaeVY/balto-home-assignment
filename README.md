# Balto's Home Assignment

This project is a Shopify app that allows you to send personalized emails to your customers based on their social media impact and presence. It uses Shopify's webhooks and APIs to track and manage customer data, and integrates with various social media platforms to enhance your email marketing campaigns. 

## Installation

To install and run this project, you need to have **Node.js** and **MongoDB** installed on your system. You also need to clone the project from GitHub using the following command:

```bash
 ~ 
➜ git clone https://github.com/AntennaeVY/balto-home-assignment.git
```

Then, navigate to the project directory and install the dependencies using:

```bash
 ~/balto-home-assignment
➜ npm install 
```

### Shopify Configuration

To install this project as a Shopify app, you need to configure some aspects of your Shopify store. Here are the steps you need to follow:

- **Step 1**: Create an account in [Shopify Partners](https://partners.shopify.com/)
- **Step 2**: Sign in to your account and create a development store, or use the pre-existing one, then log in to your store.
- **Step 3**: Once logged in to your chosen development store you need to go to **Configuration** > **Applications** > **Develop applications** > **Create an application** and choose any name for your custom store.
- **Step 4**: Install your app and go to **API Credentials**, reveal and copy the *Access Token* provided as well as the *Secret API Key*

Next, create a `.env` file in the root directory of the project and add the following variables:

```env
# This variable specifies the port number that the server will listen to for incoming requests. You can change it to any available port on your system, but make sure to update the Ngrok tunnel accordingly.
PORT=8080

# This variable specifies the connection string to the MongoDB database that will store the customer social media information. You can use a local or remote database, but make sure to provide the correct credentials and database name.
DATABASE_URI=mongodb://127.0.0.1:27017/xxxx

# This variable specifies the API secret of your custom Shopify app, which is used to verify the authenticity of the webhooks and requests from Shopify. You can find it in the app settings page in your Shopify partner dashboard.
SHOPIFY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# This variable specifies the API access token of your custom Shopify app, which allows you to access and modify the store data. You can get it from the app settings page in your Shopify partner dashboard after installing the app for the first time. It is only shown once, so if you lose it, you need to reinstall the app and generate a new one.
SHOPIFY_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


# This variable specifies the hostname of the Ngrok tunnel that exposes your local server to the internet and allows you to receive webhooks from Shopify. You can create a free Ngrok account and use the ngrok command to start a tunnel on the same port as your server or use any custom domain where you host this project
SHOPIFY_HOSTNAME=xxx.ngrok-free.app

# This variable specifies the scopes that your app needs to access the Shopify store data and perform actions on behalf of the store owner. You can use a comma-separated list of scopes, such as read_products,write_orders,etc. For this project, you only need the read_customers scope.
SHOPIFY_SCOPES=read_customers

# This variable specifies the domain of the Shopify store that you want to install and use your app.
SHOPIFY_STORE_DOMAIN=xxx.myshopify.com


# This variable specifies the Gmail email address that you want to use to send congratulatory emails to your customers. You need to enable the less secure app access option in your Gmail account settings and generate an app password for this project.
MAIL_USER_EMAIL=xxx@gmail.com

# This variable specifies the 16-digit app password that you generated for your Gmail account. You can create it in your Google account security page, under the app passwords section after enabling 2FA Authentication. 
MAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```
## Usage

To use this project, you need to run one of the following npm scripts:

- `npm run start:dev`: This will start the project in development mode, with hot reloading and debugging enabled.
- `npm run start:prod`: This will start the project in production mode, with optimized performance and security.
- `npm run build`: This will build the project and generate a `dist` folder with the compiled files.

## API Documentation

This project exposes a RESTful API with the following endpoints:

- `POST /api/v1/webhooks/shopify`: This endpoint handles the webhooks from Shopify, such as customer creation, deletion and update. 

- `POST /api/v1/webhooks/social-media`: This endpoint handles the webhooks from social media platforms, such as Facebook, Instagram, etc. (in the hypothetical scenario but this request needs to be forged). It expects a JSON payload with the following format:

```json
{
  "customer_shopify_id": number,
  "likes_gained_today": number,
  "followers_gained_today": number
}
```

- `GET /api/v1/emails`: This endpoint sends a congratulatory email to the top ten customers who have the most followers and likes on social media.

## Folder Structure

Here is an overview of the folder structure of this project:

- `src`: This folder contains the source code of the project, organized by modules and features.
- `dist`: This folder contains the compiled code of the project, generated by the `npm run build` script.
- `config`: This folder contains the configuration files of the project, such as web server, SMTP client, Shopify webhooks, and Shopify api set up.
- `jobs`: This folder contains the job queues that are used to process tasks asynchronously, such as sending emails or updating social media data.
- `libs`: This folder contains the helper code that is used by different modules and features of the project, such as logging and loading environment variables.
- `models`: This folder contains the database schema and the customer model that are used to store and manipulate the customer social media information.
- `routes`: This folder contains the controllers and the routes of the server, which handle the incoming requests and responses.
- `services`: This folder contains the services that are used to perform the core business logic of the project, such as requesting GraphQL data from Shopify or accessing the database. 
- `webhooks`: This folder contains the handlers of the webhooks that are triggered by Shopify such as customer creation, customer update, and customer deletion. 
