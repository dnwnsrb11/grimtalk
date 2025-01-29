pipeline {
    agent any

    environment {
        IMAGE_NAME = "frontend-app"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://lab.ssafy.com/hoonixox/grimtalkfront.git',
                    credentialsId: 'gitlab-credentials'
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                npm install
                npm run build
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $IMAGE_NAME .
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker stop frontend || true
                docker rm frontend || true
                docker run -d --name frontend -p 80:80 $IMAGE_NAME
                '''
            }
        }
    }

    post {
        success {
            echo 'Frontend Deployment Successful!'
        }
        failure {
            echo 'Frontend Deployment Failed.'
        }
    }
}
