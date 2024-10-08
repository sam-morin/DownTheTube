
<div align="center">
  <img src="./src/assets/play-button-4210.svg" alt="Logo" width="220">

  <h1 align="center">DownTheTube | Frontend</h1>

  <!-- [![Docker Image CI](https://github.com/sam-morin/ArcorOCR-frontend/actions/workflows/docker-image.yml/badge.svg?branch=main)](https://github.com/sam-morin/ArcorOCR-frontend/actions/workflows/docker-image.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/dwyl/hapi-auth-jwt2/badge.svg?targetFile=package.json&style=flat-square)](https://snyk.io/test/github/dwyl/hapi-auth-jwt2?targetFile=package.json)
[![Production Status](https://img.shields.io/badge/Production_Status-active-green)](https://arcorocr.com) -->

  <p align="center">
    <h3>A simple YouTube download web GUI | <a href="https://github.com/sam-morin/DownTheTube-backend-python">Backend Repo (Python)</a></h3>
    <a href="https://github.com/sam-morin/DownTheTube/issues">Report Bug</a>
    ·
    <a href="https://github.com/sam-morin/DownTheTube/issues">Request Feature</a>
    .
    <a href="#screenshot">Screenshot(s)</a>
    .
    <a href="#running">Build/Develop</a>
  </p>
</div>

<br/>

A basic YouTube viderooo downloader web GUI that runs in a docker container

### Background:
There aren't really any self-hosted YouTube video downloader web applications that I was able to find on Github. I only searched for a few minutes though, so I'm sure there are some out there, maybe.

## Objectives:
- Query: 
    Query a video via a YouTube URL and return information about the video.
- Download:
    Download a video to either the server or the server and the browser. Allow choosing the quality.


## Implemented:
- Query:
    Query a video via a YouTube URL and return information about the video.
- Download:
    Download a video to either the server or the server and the browser. Allows for choosing the quality.
    None of the available stream resolutions were progressive except for 360p. Bummer.
    1. Download video stream at the requested resolution
    2. Download the highest quality audio stream
    3. Stitch these friends together using ffmpeg
    4. Leave the video on the server in the `./DownTheTube-backend-python/downloaded-videos` folder
    5. Pass it back to the browser if requested

# Screenshot

<div align="center">
    <img src="./screenshots/screen1-dark.png" alt="Logo" width="570">
</div>
<div align="center">
    <img src="./screenshots/screen2-light.png" alt="Logo" width="570">
</div>

# Running

### For anything other than development, you'd probably be better off using Docker Compose
<a href="https://github.com/sam-morin/DownTheTube-docker-compose">Go to DownTheTube Docker Compose repo</a>

### Production
1. Clone the source and CD
```shell
git clone https://github.com/sam-morin/DownTheTube.git && cd DownTheTube
```

2. Build image
```shell
docker build . -t downthetube-frontend
```

3. Run the image
```shell
docker run -d --restart unless-stopped -p SOME_PUBLIC_PORT:80 downthetube-frontend
```

### Development

1. Clone the source and CD
```shell
git clone https://github.com/sam-morin/DownTheTube.git && cd downthetube-frontend
```

2. Install node modules
```shell
npm i
```

3. Run hot-reload dev server
```shell
npm run dev
```