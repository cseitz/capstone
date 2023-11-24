# Documents

For extensive details on this project, please check our the following documents:
- [Technical Report](./docs/Capstone%20-%20Technical%20Report.pdf) - Project Planning & Documentation
- [User Guide](./docs/Capstone%20-%20User%20Guide.pdf) - Insight into how to use the system

# Requirements

[Node.JS and NPM](https://nodejs.org/en/download/). All installer defaults will work fine, just keep clicking next. As of writing, `node v16.13.1` and `npm 8.1.2` are in use.

After installing, run `node -v` and `npm -v` and you should get 2 version numbers above or only slightly below those listed above. If this is the case, you're good to go.

If you plan on running the project in the containerized environment, [Docker](https://www.docker.com/products/docker-desktop) is required.

# Resources

- [React](https://reactjs.org/)
  - [React in 100 seconds](https://www.youtube.com/watch?v=Tn6-PIqc4UM)
  - [Usage with TypeScript Video](https://www.youtube.com/watch?v=ydkQlJhodio)
- [Next.JS](https://nextjs.org/docs/getting-started)
  - [In 100 seconds & Tutorial Video](https://www.youtube.com/watch?v=Sklc_fQBmcs&t=485s)
- [Docker](https://www.docker.com/)
  - [Docker in 100 seconds](https://www.youtube.com/watch?v=Gjnup-PuquQ)
  - [In-Depth Tutorial](https://www.youtube.com/watch?v=gAkwW2tuIqE)
- [MongoDB](https://www.mongodb.com/)
  - [MongoDB in 100 seconds](https://www.youtube.com/watch?v=-bt_y4Loofg)
  - [Mongoose](https://mongoosejs.com/docs/guide.html) (how we'll interface with MongoDB)
  - [Database Paradigms](https://www.youtube.com/watch?v=W2Z7fbCLSTw)

# Installation

```bash
cd src/app && npm install
cd ../staff && npm install
```

# Projects

## App

Located in `src/app`, this contains the frontend code for the event.

Within `src/app/pages/api` should be API routes that provide sample data that
mirrors what is provided within `src/staff/pages/api`, with the staff API actually
interfacing with the database.

When the app is not in the docker environment, sample data will be used.

## Staff

Located in `src/staff`, this contains the staff management portal and the
actual backend API code for the entire project.

## Docker

Located in `docker`, this folder provides [docker](https://www.docker.com/)
workflows to spin up a localized environment that mirrors production.

It has its own MongoDB database, NGINX load balancer and reverse proxy, and
incorporates the following routes:
```
app -> localhost
staff -> staff.localhost
staff/api -> localhost/api
```

Thus when docker is utilized, visiting `http://localhost` shows `app`, but `http://localhost/api` gets sent to the staff internal API instead of the mockup API within `app/pages/api`, and `http://staff.localhost` shows the staff management portal.


# Development

```bash
cd src/app # app or staff
npm run dev # watch for port number it says
# visit in browser at http://localhost:PORT
```

## Docker

COMING SOON

# Building

Works the same as the development commands, except `npm run build` instead of `npm run dev`.

One can then run the compiled build with `npm run start` instead of `npm run dev`, but due to it being a production build **hot reloading will be disabled**, yet the application should run faster and is a good way to gauge the actual speed, performance, and real-world compatability of the project.

# Deployment

COMING SOON


