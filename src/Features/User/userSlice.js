// src/store/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: null,
    name: "",
    email: "",
    role: "",
    profilePicture: "",
    preferences: {},
    gods: [
        {
            "god_id": "7243cb4f-188c-4982-a99f-b51a60ff0eeb",
            "active": true,
            "is_selected": true,
            "name": "Ganesha",
            "desc": "Ganesha, the revered elephant-headed deity, removes obstacles, bestows wisdom, and represents new beginnings, success, and creative energy in every endeavor."
        },
        {
            "god_id": "3a240738-c171-4ba5-928c-2b13782859e1",
            "active": true,
            "is_selected": true,
            "name": "Sai Baba",
            "desc": "Sai Baba, the compassionate saint, alleviates suffering, unites faiths, and inspires selfless service, spiritual guidance, and enduring hope among followers."
        },
        {
            "god_id": "4d8e629c-16ff-47ce-9d9b-0615e057b2fa",
            "active": true,
            "is_selected": true,
            "name": "Saraswati Devi",
            "desc": "Saraswati Devi, the goddess of knowledge, dissolves ignorance, nurtures creativity, and imparts wisdom, art, and eloquent communication for transformative growth."
        },
    ],
    activeGodId: [], // Stores the id of the selected god
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setUserProfile: (state, action) => ({ ...state, ...action.payload }),
        updateProfileField: (state, action) => {
            const { field, value } = action.payload;
            state[field] = value;
        },
        clearUserProfile: () => initialState,
        setGods: (state, action) => {
            state.gods = action.payload;
        },
        // Set the active god id. If null, no god is selected.
        setActiveGod: (state, action) => {
            state.activeGodId = action.payload;
        },
    },
});

export const { setUserProfile, updateProfileField, clearUserProfile, setGods, setActiveGod } = profileSlice.actions;
export default profileSlice.reducer;

