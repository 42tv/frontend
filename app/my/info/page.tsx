'use client'

import MyLayOut from "@/app/_components/info/layout";
import UserTab from "@/app/_components/info/tabs/user";


export default function InfoPage() {
    return (
        <MyLayOut>
            <UserTab />
        </MyLayOut>
    )
}