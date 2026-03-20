import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription, AlertAction } from '@/components/ui/alert';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerClose } from '@/components/ui/drawer';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

export default function DALCShadcnDemo() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050607] py-12">
      <Toaster position="top-center" richColors closeButton />
      <Card className="w-[420px] p-8 border border-[#C8A46B] bg-[#0d0d0f] mb-8">
        <h2 className="text-[#C8A46B] text-xl font-bold mb-4">DALC Shadcn Demo</h2>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="border border-[#C8A46B] bg-[#C8A46B]/10">
            <img src="https://dalc.ai/logo.png" alt="DALC" className="rounded-full" />
          </Avatar>
          <span className="text-[#C8A46B] font-semibold">DALC User</span>
        </div>
        <Badge className="bg-[#C8A46B] text-black mb-4">Gold Badge</Badge>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="bg-[#C8A46B] text-black mb-4">Popover Button</Button>
          </PopoverTrigger>
          <PopoverContent className="bg-[#0d0d0f] border border-[#C8A46B] text-white">DALC Popover Content</PopoverContent>
        </Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="border-[#C8A46B] text-[#C8A46B] mb-4">Tooltip Button</Button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#C8A46B] text-black border border-[#C8A46B]">DALC Tooltip Content</TooltipContent>
        </Tooltip>
        <Button className="bg-[#C8A46B] text-black hover:bg-[#EFD7A4] mb-4" onClick={() => toast("DALC Toast: Action completed!", { description: "This is a Sonner toast with DALC styling." })}>DALC Button (Toast)</Button>
        <Switch className="mb-4" defaultChecked />
        <Skeleton className="h-6 w-32 bg-[#C8A46B]/20 mb-4" />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-[#C8A46B] text-[#C8A46B] mb-4">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0d0d0f] border border-[#C8A46B]">
            <DialogTitle className="text-[#C8A46B]">DALC Dialog</DialogTitle>
            <DialogDescription className="text-white/80 mb-4">This is a DALC-styled dialog using shadcn UI.</DialogDescription>
            <DialogClose asChild>
              <Button className="bg-[#C8A46B] text-black mt-2">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="border-[#C8A46B] text-[#C8A46B] mt-4">Open Drawer</Button>
          </DrawerTrigger>
          <DrawerContent className="bg-[#0d0d0f] border-t border-[#C8A46B]">
            <DrawerHeader className="text-[#C8A46B]">DALC Drawer</DrawerHeader>
            <div className="text-white/80 mb-4">This is a DALC-styled drawer using shadcn UI.</div>
            <DrawerClose asChild>
              <Button className="bg-[#C8A46B] text-black mt-2">Close Drawer</Button>
            </DrawerClose>
          </DrawerContent>
        </Drawer>
        <Alert variant="default" className="border-[#C8A46B] bg-[#1a1a1d] text-[#C8A46B] mt-6">
          <AlertTitle>DALC Alert</AlertTitle>
          <AlertDescription>This is a DALC-styled alert using shadcn UI.</AlertDescription>
          <AlertAction>
            <Button size="sm" className="bg-[#C8A46B] text-black">Action</Button>
          </AlertAction>
        </Alert>
        <Table className="mt-6 border border-[#C8A46B]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#C8A46B]">Name</TableHead>
              <TableHead className="text-[#C8A46B]">Role</TableHead>
              <TableHead className="text-[#C8A46B]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-white">Mehdi</TableCell>
              <TableCell className="text-white">Admin</TableCell>
              <TableCell className="text-[#C8A46B]">Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-white">Alex</TableCell>
              <TableCell className="text-white">User</TableCell>
              <TableCell className="text-[#C8A46B]">Pending</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
      <Tabs defaultValue="tab1" className="w-[420px] border border-[#C8A46B] rounded-xl bg-[#0d0d0f] p-6">
        <TabsList className="mb-4 flex gap-2">
          <TabsTrigger value="tab1" className="bg-[#C8A46B] text-black">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" className="bg-[#C8A46B] text-black">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="text-white">DALC Tab 1 Content</TabsContent>
        <TabsContent value="tab2" className="text-white">DALC Tab 2 Content</TabsContent>
      </Tabs>
    </div>
  );
}
