import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatPage from './pages/chat/ChatPage';
import HomePage from './pages/home/HomePage';
import "./App.css";

function App() {
    

    const router = createBrowserRouter([
        {
            path: "/",
            element: <HomePage />,
        },
        {
            path: "/chat",
            element: <ChatPage />,
        },
        // {
        //     path: "/chat",
        //     children: [
        //         {
        //             path: "/",
        //             element: <ChatPage />,
        //         },
        //         // {
        //         //     path: "/dashboard/chats/:id",
        //         //     element: <ChatPage />,
        //         // },
        //     ],
        // },
    ]);

    return (
        <div className="root">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
