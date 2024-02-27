pipeline {
    agent any

    stages {
        stage('Install dependencies') {
            steps {
                script {
                    // Install dependencies using npm
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    // Build the Nest.js project
                    sh 'npm run build'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    // Run tests for the Nest.js project
                    sh 'npm test'
                }
            }
        }

        stage('Deploy') {
            steps {
                // Add deployment steps here
            }
        }
    }
}
