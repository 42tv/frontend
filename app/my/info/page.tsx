'use client'

import MyLayOut from "@/app/my/info/components/layout";
import UserTab from "@/app/my/info/components/tabs/user";


export default function InfoPage() {
    return (
        <MyLayOut>
            <UserTab />
        </MyLayOut>
    )
}