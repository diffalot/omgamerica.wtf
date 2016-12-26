#!groovy

/*
The MIT License

Copyright (c) 2015-, CloudBees, Inc., and a number of other of contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software dotspacemacs-additional-packagesis
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

properties([[$class: 'GitLabConnectionProperty', gitLabConnection: 'gitlab.gigantic.computer']])

node('jenkins-minion') {

  currentBuild.result = "SUCCESS"

  print "Build Is Starting for ${env.BUILD_TAG}"

  try {

    gitlabCommitStatus("git checkout") {
      stage('git checkout') {

        checkout scm
      }
    }

    gitlabCommitStatus("npm install") {
      stage('npm install') {
        env.NODE_ENV = "development"

        sh 'npm install'
      }
    }

    gitlabCommitStatus("npm test") {
      stage('npm test') {
        env.NODE_ENV = "development"

        sh 'npm test'
      }
    }

    gitlabCommitStatus("docker build") {
      stage('docker build') {

        sh 'npm prune --production'

        sh '$(aws ecr get-login --region=us-east-1)'

        docker.withRegistry("https://541790730179.dkr.ecr.us-east-1.amazonaws.com") {
          docker.build("ms-wtf:${env.BUILD_TAG}").push()
        }
      }
    }

    switch (env.BRANCH_NAME) {
    case 'master':
    gitlabCommitStatus("docker deploy") {
      stage("docker deploy") {

        sh "kubectl set image deployment/ms-wtf ms-wtf=541790730179.dkr.ecr.us-east-1.amazonaws.com/ms-wtf:${env.BUILD_TAG} --namespace=omgamerica"
        sh "kubectl rollout status deployment/ms-wtf --namespace=omgamerica"

      }
    }
    }

  }

  catch (err) {

    currentBuild.result = "FAILURE"

    mail body: "project build error is here: ${env.BUILD_URL}" ,
               from: 'xxxx@yyyy.com',
               replyTo: 'yyyy@yyyy.com',
               subject: 'project build failed',
               to: 'zzzz@yyyyy.com'

    throw err
  }

}
