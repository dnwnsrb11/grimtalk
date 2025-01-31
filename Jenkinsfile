pipeline {
    agent any

    environment {
        IMAGE_NAME = "frontend-app"
        CONTAINER_NAME = "frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://lab.ssafy.com/hoonixox/grimtalkfront.git', credentialsId: 'gitlab-credentials'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                docker build -t ${IMAGE_NAME} .
                """
            }
        }

        stage('Deploy (Frontend Only)') {
            steps {
                sshagent(['ubuntu-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@i12d202.p.ssafy.io << 'EOF'
                    
                    cd /home/ubuntu

                    echo "🛑 기존 프론트엔드 컨테이너 삭제"
                    docker-compose stop frontend || true
                    docker-compose rm -f frontend || true

                    echo "🗑️ 불필요한 Docker 이미지 및 볼륨 삭제"
                    docker rmi $(docker images -f "dangling=true" -q) || true
                    docker volume prune -f

                    echo "🚀 프론트엔드 컨테이너 다시 실행"
                    docker-compose up -d --build frontend

                    echo "✅ 프론트엔드 배포 완료! 현재 컨테이너 상태:"
                    docker ps -a
                    
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Frontend Deployment Successful!'
        }
        failure {
            echo '❌ Frontend Deployment Failed.'
        }
    }
}
