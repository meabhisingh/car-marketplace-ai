import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddCarForm, GenerateImage } from "./components";

const Page = () => {
  return (
    <main className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4">
        <Tabs defaultValue="add-car" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="add-car">Add Car</TabsTrigger>
            <TabsTrigger value="generate-image">Generate Image</TabsTrigger>
          </TabsList>

          <TabsContent value="add-car" className="w-[50rem]">
            <AddCarForm />
          </TabsContent>
          <TabsContent value="generate-image" className="w-[50rem]">
            <GenerateImage />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Page;
