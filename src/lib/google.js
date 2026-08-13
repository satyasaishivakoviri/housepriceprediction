const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

export const getGoogleAuthURL = (state) => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: GOOGLE_CALLBACK_URL,
        client_id: GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
        state: state,
    };

    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
};

export const getGoogleUser = async (code, isMock = false) => {
    // MOCK MODE for Verification Script
    if (isMock || process.env.MOCK_GOOGLE_AUTH === 'true') {
        console.log("Mocking Google Auth Exchange...");
        return {
            email: "mock_google_user@example.com",
            name: "Mock Google User",
            picture: "https://ui-avatars.com/api/?name=Mock+Google&background=random",
            id: "mock_google_id_12345",
            verified_email: true
        };
    }

    // Step 1: Exchange code for token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_CALLBACK_URL,
            grant_type: "authorization_code",
        }),
    });

    if (!tokenResponse.ok) {
        throw new Error(`Google Token Error: ${tokenResponse.statusText}`);
    }

    const { id_token, access_token } = await tokenResponse.json();

    // Step 2: Get User Info
    const userResponse = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        }
    );

    if (!userResponse.ok) {
        throw new Error(`Google User Info Error: ${userResponse.statusText}`);
    }

    return await userResponse.json();
};
