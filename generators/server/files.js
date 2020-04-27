/**
 * Copyright 2013-2020 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const mkdirp = require('mkdirp');
const cleanup = require('../cleanup');
const constants = require('../generator-constants');

/* Constants use throughout */
const INTERPOLATE_REGEX = constants.INTERPOLATE_REGEX;
const DOCKER_DIR = constants.DOCKER_DIR;
const TEST_DIR = constants.TEST_DIR;
const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
const SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;
const SERVER_TEST_RES_DIR = constants.SERVER_TEST_RES_DIR;
const REACT = constants.SUPPORTED_CLIENT_FRAMEWORKS.REACT;

const shouldSkipUserManagement = generator =>
    generator.skipUserManagement && (generator.applicationType !== 'monolith' || generator.authenticationType !== 'oauth2');
/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */
const serverFiles = {
    serverBuild: [
        {
            templates: [{ file: 'checkstyle.xml', options: { interpolate: INTERPOLATE_REGEX } }]
        },
        {
            condition: generator => generator.buildTool === 'gradle',
            templates: [
                'build.gradle',
                'settings.gradle',
                'shared.gradle',
                { file: 'gradlew', method: 'copy', noEjs: true },
                { file: 'gradlew.bat', method: 'copy', noEjs: true },
                { file: 'gradle/wrapper/gradle-wrapper.jar', method: 'copy', noEjs: true },
                'gradle/wrapper/gradle-wrapper.properties'
            ]
        },
    ],
    serverMicroservice: [
        {
            condition: generator => generator.applicationType == 'microservice',
            path: 'api/',
            templates: [
                'build.gradle',
                'settings.gradle',
                {
                    file: 'src/main/java/package/api/v1/client/IamATeapotException.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/api/v1/client/IamATeapotException.java`
                },
                {
                    file: 'src/main/java/package/api/v1/client/TemplateManager.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/api/v1/client/TemplateManager.java`
                },
                {
                    file: 'src/main/java/package/api/v1/domain/Sample.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/api/v1/domain/Sample.java`
                },
                {
                    file: 'src/main/java/package/api/v1/events/EventConstants.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/api/v1/events/EventConstants.java`
                },
                {
                    file: 'src/main/java/package/api/v1/PermittableGroupIds.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/api/v1/PermittableGroupIds.java`
                },
                {
                    file: 'src/test/java/package/api/v1/domain/SampleTest.java',
                    renameTo: generator => `src/test/java/${generator.javaDir}/${generator.baseName}/api/v1/domain/SampleTest.java`
                }
            ],
        },
        {
            condition: generator => generator.applicationType == 'microservice',
            path: 'component-test/',
            templates: [
                'build.gradle',
                'settings.gradle',
                {
                    file: 'src/main/java/package/TestSuite.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/TestSuite.java`
                },
                {
                    file: 'src/main/java/package/TestSample.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/TestSample.java`
                },
                {
                    file: 'src/main/java/package/SuiteTestEnvironment.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/SuiteTestEnvironment.java`
                },
                {
                    file: 'src/main/java/package/listener/MigrationEventListener.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/listener/MigrationEventListener.java`
                },
                {
                    file: 'src/main/java/package/listener/SampleEventListener.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/listener/SampleEventListener.java`
                }
            ],
        },
        {
            condition: generator => generator.applicationType == 'microservice',
            path: 'service/',
            templates: [
                'build.gradle',
                'settings.gradle',
                'src/main/resources/db/migrations/postgresql/V1__initial_setup.sql',
                'src/main/resources/application.yml',
                'src/main/resources/bootstrap.yml',
                {
                    file: 'src/main/java/package/service/ServiceConstants.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/service/ServiceConstants.java`
                },
                {
                    file: 'src/main/java/package/service/TemplateApplication.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/service/TemplateApplication.java`
                },
                {
                    file: 'src/main/java/package/service/TemplateConfiguration.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/service/TemplateConfiguration.java`
                },
                {
                    file: 'src/main/java/package/service/internal/command/InitializeServiceCommand.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/service/internal/InitializeServiceCommand.java`
                },
                {
                    file: 'src/main/java/package/service/internal/command/SampleCommand.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/service/internal/SampleCommand.java`
                },
                {
                    file: 'src/main/java/package/service/internal/command/handler/MigrationAggregate.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/service/internal/handler/MigrationAggregate.java`
                },
                {
                    file: 'src/main/java/package/service/internal/command/handler/SampleAggregate.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/service/internal/handler/SampleAggregate.java`
                },
                {
                    file: 'src/main/java/package/service/internal/mapper/SampleMapper.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/service/internal/mapper/SamplerMapper.java`
                },
                {
                    file: 'src/main/java/package/service/internal/repository/SampleJpaEntity.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/service/internal/repository/SampleJpaEntity.java`
                },
                {
                    file: 'src/main/java/package/service/internal/repository/SampleJpaEntityRepository.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/service/internal/repository/SampleJpaEntityRepository.java`
                },
                {
                    file: 'src/main/java/package/service/internal/service/SampleService.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/service/internal/service/SampleService.java`
                },
                {
                    file: 'src/main/java/package/service/rest/SampleRestController.java',
                    renameTo: generator => `src/main/java/${generator.javaDir}/${generator.baseName}/service/rest/SampleRestController.java`
                },
            ]
        }
    ]
};

function writeFiles() {
    return {
        setUp() {
            this.javaDir = `${this.packageFolder}/`;
            this.testDir = `${this.packageFolder}/`;

            // Create Java resource files
            // mkdirp(SERVER_MAIN_RES_DIR);
            // mkdirp(`${SERVER_TEST_SRC_DIR}/${this.testDir}`);
            // this.generateKeyStore();
        },

        cleanupOldServerFiles() {
            cleanup.cleanupOldServerFiles(
                this,
                `${SERVER_MAIN_SRC_DIR}/${this.javaDir}`,
                `${SERVER_TEST_SRC_DIR}/${this.testDir}`,
                SERVER_MAIN_RES_DIR,
                SERVER_TEST_RES_DIR
            );
        },

        writeFiles() {
            this.writeFilesToDisk(serverFiles, this, false, this.fetchFromInstalledJHipster('server/templates'));
        }
    };
}

module.exports = {
    writeFiles,
    serverFiles
};
