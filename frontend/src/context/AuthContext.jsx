import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api.js";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    const loadUser = async () => {
        try {
            const { data } = await api.get("/auth/me");
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return data;
    };

    const signup = async (name, email, password) => {
        const { data } = await api.post("/auth/signup", { name, email, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return data;
    };

    const googleLogin = async (credential) => {
        const { data } = await api.post("/auth/google", credential);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const forgotPassword = async (email) => {
        const { data } = await api.post("/auth/forgot-password", { email });
        return data;
    };

    const resetPassword = async (token, password) => {
        const { data } = await api.post(`/auth/reset-password/${token}`, { password });
        localStorage.setItem("token", data.token);
        return data;
    };

    const updatePreferences = async (prefs) => {
        const { data } = await api.put("/auth/preferences", prefs);
        setUser((prev) => ({ ...prev, preferences: data.preferences }));
        return data;
    };

    const value = {
        user,
        loading,
        login,
        signup,
        googleLogin,
        logout,
        forgotPassword,
        resetPassword,
        updatePreferences,
        setUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
