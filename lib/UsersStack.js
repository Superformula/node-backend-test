const cdk = require('@aws-cdk/core');
const dynamodb = require('@aws-cdk/aws-dynamodb');

class UsersStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);

        const usersStack = this;

        // create users table
        const usersTable = new dynamodb.Table(usersStack, 'Users', {
            partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY, // allow table delete
        });
    }
}

module.exports = { UsersStack };
