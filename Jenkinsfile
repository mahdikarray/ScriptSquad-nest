pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Clean') {
            steps {
                sh 'rm -rf target/*'
            }
        }

    }

    post {
        success {
            echo 'Build successful! Deploying...'
            // Add deployment steps here
        }
        failure {
            echo 'Build failed! Sending notification...'
            // Add notification steps here
        }
    }
}
