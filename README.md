# Project Name

Bonds alerting system

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

## Introduction

Our project focuses to cut down the manual labour of investors to keep looking at bonds which gives more xirr%.

## Features

- Alerts users when xirr rate crosses threshold set by users on those bonds.
- Keeps track of bond's xirr status every 30 sec.

## Getting Started

### Prerequisites

npm version 9.2.0, node version 18.13.0, java spring boot version 3.2.2

### Installation

Clone the Repository

1)   Open your terminal.

2)   Navigate to the directory where you want to clone the repository.

3)   Run the following command:

    `git clone <repository-url>'

#### Frontend

Navigate to the frontend directory

1)   Change into the directory of your frontend code

    `cd <repository-directory>/frontend`

2)   Replace <repository-directory> with the name of the directory created during the clone.

3)   Install the necessary dependencies:

    `npm install`

4)   Start the frontend development server:

    `npm start`

5)   Access the frontend API 

     http://localhost:3000

#### Backend

Navigate to the Backend Directory  

1)   Change into the directory of your backend code:

    `cd <repository-directory>/backend`

2)   Build and run the backend application

    `mvn spring-boot:run`

3)   Access the backend API 

     http://localhost:8080

#### Database Setup

Setup your database

1)   Update the system repositories: To update system repositories, use the following command in the terminal by pressing “CTRL+ALT+T”:

     `sudo apt update`

2)   Install the MySQL server on your PC using the following command in the next step:

      `sudo apt-get install mysql-server`

3)   Check the status of MySQL service. Check the “MySQL” service’s status next:

      `systemctl is-active mysql`

4)   Configure MySQL server. Now, type the command shown below to configure the MySQL server in its first, interactive configuration:

      `sudo mysql_secure_installation`

5)   Install MySQL Workbench Community using sudo aptitude

      `sudo snap install mysql-workbench-community`

6)   Open the mysql workbench UI

7)   Click on + icon to add connection

10)  In connection name write "mydb"

11)  In host name paste this end point link

      `mydb.cx4mcmwqcij8.ap-southeast-2.rds.amazonaws.com`

12) In username set it to 'root'

13) In password set 'atylbvc_+90B'

14) Click on Test connection to know if you are able to connect or not

15) Now click on ok

