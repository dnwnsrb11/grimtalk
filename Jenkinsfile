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

        stage('Setup Node.js & pnpm') {
            steps {
                sh '''
                if ! command -v node &> /dev/null
                then
                    echo "Node.js not found. Installing..."
                    apt update
                    apt install -y nodejs npm
                fi

                if ! command -v pnpm &> /dev/null
                then
                    echo "pnpm not found. Installing..."
                    npm install -g pnpm
                fi
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'pnpm install'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'pnpm run build'
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
