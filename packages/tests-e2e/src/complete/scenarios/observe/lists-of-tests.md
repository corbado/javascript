# Observe integration into complete

- [ ]  merge shared-ui package into react packge
- [ ]  integrate observe login and signup flows
- [ ]  manual testing using local react demo
- [ ]  validate all login methods locally (manual testing)

## 2 Login methods testing

| **type**                                           | **scenario**                                                                       | preconditions                                    | **status** |
|----------------------------------------------------|------------------------------------------------------------------------------------|--------------------------------------------------|------------|
| passkey-cui                                        | successful                                                                         | confirmed_user_with_pk                           |            |
|                                                    | successful after cancelled                                                         | confirmed_user_with_pk                           |            |
|                                                    | successful after pk_deleted                                                        | confirmed_user_with_server_deleted_pk            |            |
|                                                    | incomplete after cancelled                                                         | confirmed_user_with_pk                           |            |
| social-mock                                        | successful                                                                         | confirmed_user_without_pk, social_success        |            |
|                                                    | successful after cancelled                                                         | confirmed_user_without_pk, social_cancel         |            |
|                                                    | successful after back                                                              | confirmed_user_without_pk, social_navigate_back, |            |
|                                                    | incomplete after cancelled                                                         | confirmed_user_without_pk, social_cancel         |            |
| identifier-passkey                                 | successful                                                                         | confirmed_user_with_pk                           |            |
|                                                    | successful after cancelled                                                         | confirmed_user_with_pk                           |            |
|                                                    | successful after cancelled (2x)                                                    | confirmed_user_with_pk                           |            |
|                                                    | incomplete after cancelled                                                         | confirmed_user_with_pk                           |            |
|                                                    | incomplete after cancelled (2x)                                                    | confirmed_user_with_pk                           |            |
|                                                    | successful after cancelled passkey and cancelled email_otp                         | confirmed_user_with_pk                           |            |
| identifier-email_otp                               | successful (user_no_pk)                                                            | confirmed_user_without_pk                        |            |
|                                                    | successful after wrong_code                                                        | confirmed_user_without_pk                        |            |
|                                                    | successful after wrong_code (2x)                                                   | confirmed_user_without_pk                        |            |
|                                                    | incomplete after wrong_code                                                        | confirmed_user_without_pk                        |            |
|                                                    | successful after cancelled passkey                                                 | confirmed_user_with_pk                           |            |
|                                                    | successful after passkey (email confirmation needed)                               | unconfirmed_user_with_pk                         |            |
| identifier-email_link                              | successful (post-signup email)                                                     | unconfirmed_user_without_pk                      |            |
| reset-flow (can be combined with any login method) | successful with passkey-cui, same identifier after cancelled passkey               | confirmed_user_with_pk                           |            |
|                                                    | successful with social-mock, same identifier after cancelled passkey               | confirmed_user_with_pk, social_success           |            |
|                                                    | successful with social-mock, same identifier after incomplete identifier-email_otp | confirmed_user_without_pk, social_success        |            |
|                                                    | successful with passkey-cui, different identifier after cancelled passkey          | confirmed_user_with_pk                           |            |
|                                                    | successful with social-mock, different identifier after cancelled passkey          | confirmed_user_with_pk, social_success           |            |
| passkey-button                                     | successful identifier-passkey (passkey-button)                                     | confirmed_user_with_pk                           |            |
|                                                    | successful identifier-passkey (passkey-button, 1 cancel)                           | confirmed_user_with_pk                           |            |
|                                                    | successful identifier-passkey (passkey-button, 2 cancel)                           | confirmed_user_with_pk                           |            |
|                                                    | successful identifier-email_top (passkey-button)                                   | confirmed_user_with_pk                           |            |

## 3 Enrollment testing

| **type** | **scenario**                                  | preconditions                         | **status** |
|----------|-----------------------------------------------|---------------------------------------|------------|
| passkey  | successful (conditional)                      | -                                     |            |
|          | successful (auto)                             | -                                     |            |
|          | successful (manual)                           | -                                     |            |
|          | successful (manual) after cancelled auto      | -                                     |            |
|          | skipped after cancelled auto                  | -                                     |            |
|          | invisible (user_with_pk)                      | confirmed_user_with_pk                |            |
|          | successful (manual) after passkey-login-error | confirmed_user_with_server_deleted_pk |            |
|          |                                               |                                       |            |
|          |                                               |                                       |            |
