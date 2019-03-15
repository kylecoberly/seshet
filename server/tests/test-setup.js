process.env.NODE_ENV = "test";
global.assert = require("assert");
global.expect = require("chai").expect;
global.request = require("supertest");

global.testDatabase = require("../src/database-connection");
global.app = require("../src/app");
