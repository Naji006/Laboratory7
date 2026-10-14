# Campus Connect

An Ionic 9 + Angular student directory for NEUST. Connects to the live API at `https://ipt02-student-directory.netlify.app/api`.

## Run

Use Node **24.15.0 or newer within Node 24** (required by the installed Angular version).

```sh
npm ci
npm start -- --host 0.0.0.0 --port 4200
```

In the task sandbox, the supported runtime is available through mise:

```sh
mise exec node@24.15.0 -- npm start -- --host 0.0.0.0 --port 4200
```

Open http://localhost:4200. The responsive app supports mobile and desktop browsers. Capacitor configuration is included; native Android/iOS platform projects are not included.

## App flows

- **Register:** POST `/register` with the instructor's class registration token, Student ID, name, password, section, email, and optional contact/profile links. Get the class token from your instructor; it is entered by the student and is never embedded in the app.
- **Login:** POST `/login`. Save the returned JWT under `auth_token` and student profile under `student_user` in localStorage. Passwords and registration tokens are not persisted.
- **Directory:** GET `/students` with `Authorization: Bearer <token>`. Search by name, Student ID, section, or email; filter by section; refresh from the server.
- **Profile:** PUT `/students/:student_id` with the JWT and editable profile details. The Student ID comes from the authenticated session and cannot be edited.
- **Logout:** Clear local session storage. Protected pages redirect to login when there is no session or the API returns 401.

Every request displays a server success message or error in the interface. Registration stays on its success screen until the user continues to login. Requests time out after 20 seconds. There is no hardcoded account, class token, or sample directory in the app.

localStorage follows the laboratory's JWT storage requirement. For a deployed native app, consider device secure storage and the applicable authentication threat model.

## Verification

```sh
npm run build
npm run lint
npm test -- --watch=false
```

Tests cover endpoint methods/payloads, Bearer authentication, login persistence, failed updates, logout, incomplete login responses, and URL safety, plus page creation. HTTP tests use synthetic fixtures and do not create or edit students on the public server. Live success verification requires a valid student account and the instructor's registration token.
