# sta-blog-server AGENTS.md

**Generated:** 2026-07-05

## OVERVIEW

Legacy Spring Boot backend for the sta-blog project. Being replaced by `ruoyi-vue-pro/sta-module-blog`. Only maintain for backward compatibility during migration.

## STRUCTURE

```
sta-blog-server/
├── src/main/java/           # Java controllers, services, mappers, models
├── src/main/resources/      # application.yml, static assets, templates
└── src/test/                # Unit tests
```

## STATUS

This server is **legacy** — do not add new features here. New development goes to `ruoyi-vue-pro/sta-module-blog`. The old frontend (`sta-blog-ui/src/apis/`) still references this server's endpoints; migrate those to `sta-blog-ui/src/api/` (auto-generated from Ruoyi backend).

## COMMANDS

```bash
# Run
mvn spring-boot:run

# Package
mvn clean package -DskipTests
```
