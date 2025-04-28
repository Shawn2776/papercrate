"use client";

import { UserButton } from "@clerk/nextjs";
import React from "react";
import { MdDashboard } from "react-icons/md";

const UserComponent = () => {
  return (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Action
          label="Go to Dashboard"
          labelIcon={<MdDashboard />}
          onClick={() => redirect("/dashboard")}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
};

export default UserComponent;
