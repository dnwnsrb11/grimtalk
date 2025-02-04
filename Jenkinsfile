pipeline {
    agent any

    environment {
        IMAGE_NAME = "my-frontend-nginx"
        CONTAINER_NAME = "nginx"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://lab.ssafy.com/hoonixox/grimtalkfront.git',
                    credentialsId: 'gitlab-credentials'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                docker build -t ${IMAGE_NAME} .
                """
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['ubuntu-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@i12d202.p.ssafy.io << 'EOF'
                    
                    cd /home/ubuntu

                    echo "🛑 기존 nginx 컨테이너 중단/삭제"
                    docker-compose stop nginx || true
                    docker-compose rm -f nginx || true

                    echo "🗑️ Dangling 이미지/볼륨 제거"
                    docker rmi $(docker images -f "dangling=true" -q) || true
                    docker volume prune -f

                    echo "🚀 새 nginx 컨테이너 배포 (프론트 통합)"
                    docker-compose up -d --build nginx

                    echo "✅ 배포 완료. 현재 컨테이너 상태:"
                    docker ps -a
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful!'
        }
        failure {
            echo '❌ Deployment Failed.'
        }
    }
}
