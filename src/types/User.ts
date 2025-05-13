export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
};

export type UserResponse = {
    user: User;
    token: string;
};

