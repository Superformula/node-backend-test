#!/usr/bin/env node
const { App, Tag } = (cdk = require('@aws-cdk/core'));
const { UsersStack } = require('../lib/UsersStack');

const app = new App();
const STACK_NAME = process.env.STACK_NAME || 'SF-UserStack';
const STAGE = (app.node.tryGetContext('stage') || 'dev').toUpperCase();

const stack = new UsersStack(app, STAGE, {
    stackName: `${STACK_NAME}-${STAGE}`,
});

Tag.add(stack, 'stack', STACK_NAME);
Tag.add(stack, 'stage', STAGE);
