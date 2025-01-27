# Stak'Eirb

## Overview

Stak'Eirb is a web course project developed collaboratively with @TodoniK, intended to apply and showcase our acquired knowledge.

The objective of this project is to build a web application. We have chosen to create an online casino site. The goal is straightforward: to wager virtual money on games of chance and strive to win as much money as possible.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v12.16.1)
- [Vue.js](https://vuejs.org/) (v2.6.11)

### Setup

1. Clone the repository

```bash
git clone git@github.com:imjxlian/stakeirb.git
```

2. Create .env

Need to create a JWT_TOKEN_KEY in a /stakeirb-back/.env to be able to sign your requests.

3. Install dependencies

```bash
cd stakeirb-front && npm install && cd ../stakeirb-back && npm install
```

4. Run the server

```bash
cd stakeirb-back && npm run dev && cd ../stakeirb-front && npm run dev
```

5. Open the application

```bash
open http://localhost:5173
```

## Features

### Games

#### Dice

We decided to focus on the dice game. The rules are simple: the player chooses a number to roll over or under, and the amount he wants to bet. The dice is then rolled, and if the player's number is rolled, he wins the amount he bet multiplied by the odds. Otherwise, he loses his bet.

### User management

#### Registration

A user can register on the site by providing a username, an email address and a password. The username and email address must be unique.

#### Login

A user can log in to the site by providing his email address and password.

#### Profile

A user can view his profile, which contains his username, statistics and a list of his bets.

#### Tip

A user can tip another user by clicking on his profile click the tip button. The user must decide the amount he wants to tip. The amount is then deducted from his balance and added to the balance of the user he tipped.

### Bets

#### History

A user can view his bet history, which contains the date, the amount bet and the multiplier of each bet.

#### Statistics

A user can view his statistics, which contains the number of bets he has made, the total amount he has wagered, and the total amount he has won.
