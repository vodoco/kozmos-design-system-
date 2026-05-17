
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Input, Card, Badge } from '@kozmos/react';

const meta: Meta = {
    title: 'Examples/Map Based Search',
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => (
        <div className="relative flex h-screen w-full flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white">
            {/* Map Container */}
            <div className="relative flex-1 w-full h-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                {/* Map Background */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    data-alt="Vector map of indoor shopping mall layout"
                    data-location="Indoor Mall Map"
                    style={{ backgroundImage: 'url("https://placeholder.pics/svg/300")' }}
                >
                    {/* Simulated Map Elements/Pins */}
                    {/* Pin 1 */}
                    <div className="absolute top-[35%] left-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                        <div className="bg-white dark:bg-gray-800 text-xs font-semibold px-2 py-1 rounded shadow-md mb-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Bean There</div>
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-gray-800 transform transition-transform hover:scale-110">
                            <span className="material-symbols-outlined text-sm">coffee</span>
                        </div>
                    </div>
                    {/* Pin 2 (Active) */}
                    <div className="absolute top-[45%] left-[60%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 cursor-pointer">
                        <div className="bg-white dark:bg-gray-800 text-xs font-semibold px-2 py-1 rounded shadow-md mb-1 whitespace-nowrap">The Daily Grind</div>
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-xl border-2 border-white dark:border-gray-800 ring-4 ring-primary/20 transform scale-110">
                            <span className="material-symbols-outlined text-base">local_cafe</span>
                        </div>
                    </div>
                    {/* Pin 3 */}
                    <div className="absolute top-[55%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                        <div className="bg-white dark:bg-gray-800 text-xs font-semibold px-2 py-1 rounded shadow-md mb-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Espresso Lab</div>
                        <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 shadow-lg border-2 border-white dark:border-gray-800 transform transition-transform hover:scale-110">
                            <span className="material-symbols-outlined text-sm">coffee</span>
                        </div>
                    </div>
                </div>

                {/* Top UI Layer */}
                <div className="absolute top-0 left-0 right-0 z-20 flex flex-col gap-4 p-4 pt-12 bg-gradient-to-b from-white/90 via-white/50 to-transparent dark:from-black/80 dark:via-black/40 pointer-events-none">
                    {/* Search Bar */}
                    <div className="pointer-events-auto shadow-lg rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center p-1">
                        <div className="flex items-center justify-center pl-3 text-gray-400 dark:text-gray-500">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <Input
                            className="border-none shadow-none focus-visible:ring-0 placeholder:text-gray-400 dark:placeholder-gray-500 text-base h-12"
                            placeholder="Search for coffee shops"
                            defaultValue="Coffee shops"
                        />
                        <Button variant="ghost" size="icon" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                            <span className="material-symbols-outlined">mic</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="mr-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 h-8 w-8">
                            <span className="material-symbols-outlined text-sm">tune</span>
                        </Button>
                    </div>
                    {/* Filter Chips */}
                    <div className="pointer-events-auto flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        <Button size="sm" className="rounded-full gap-1.5 shadow-sm">
                            <span className="material-symbols-outlined text-sm">check</span>
                            Open Now
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                            Top Rated
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                            Nearby
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                            Offers
                        </Button>
                    </div>
                </div>

                {/* Right Side Controls */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-end gap-3 pointer-events-auto z-20">
                    <div className="flex flex-col gap-px rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                            <span className="material-symbols-outlined">add</span>
                        </Button>
                        <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                            <span className="material-symbols-outlined">remove</span>
                        </Button>
                    </div>
                    <Button variant="secondary" size="icon" className="h-10 w-10 rounded-lg bg-white dark:bg-gray-800 shadow-md text-primary hover:bg-gray-50 dark:hover:bg-gray-700">
                        <span className="material-symbols-outlined">near_me</span>
                    </Button>
                    <Button variant="secondary" size="icon" className="h-10 w-10 rounded-lg bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <span className="material-symbols-outlined">layers</span>
                    </Button>
                </div>

                {/* Bottom Overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none flex flex-col justify-end pb-24 bg-gradient-to-t from-white/10 to-transparent">
                    {/* Search Area Button */}
                    <div className="flex justify-center mb-4 pointer-events-auto">
                        <Button variant="secondary" className="gap-2 rounded-full shadow-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-primary">
                            <span className="material-symbols-outlined text-sm">refresh</span>
                            <span className="text-sm font-bold">Search this area</span>
                        </Button>
                    </div>

                    {/* Carousel */}
                    <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory no-scrollbar pointer-events-auto">
                        {/* Card 1 */}
                        <div className="flex-none snap-center w-[85%] max-w-[320px]">
                            <Card className="flex gap-3 h-28 p-3 hover:shadow-xl transition-shadow cursor-pointer border-gray-100 dark:border-gray-700">
                                <div className="w-24 h-full shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                                    <div className="absolute inset-0 bg-cover bg-center" data-alt="Interior of Bean There coffee shop" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCltDuCuwOSU97giXrdM2m75kTzzZGbxSMsNnKcQhMMz15RHcAwbE7P0l4I7yEQdP4oqNdW_8-X7Y6vrvcK2EwPFY_q2pqCXfT89Y5vRZlsyv4QGdSsayNZjNlhsEJt-epA4u2WApcUDbvgUXBvCmZSWMsv4tkllHm8VVzjTGIBMsdpHpWOIakkxlshdeFbyMFZgag3AYEhji8Ih4ZXhek8xXF-obrjqgkYeeA08EP1cQjFBb7Nwi9qSXR89_tIcdwNKlgUjsslWMJt")' }}></div>
                                </div>
                                <div className="flex flex-col justify-between flex-1 py-0.5">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900 dark:text-white truncate">Bean There</h3>
                                            <Badge variant="secondary" className="flex items-center text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded border-none shadow-none">
                                                4.5 <span className="material-symbols-outlined text-[10px] ml-0.5">star</span>
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Level 1 • Near Entrance</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs font-medium text-green-600 dark:text-green-400">Open • Closes 9PM</span>
                                        <span className="text-xs text-gray-400">2 min</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        {/* Card 2 (Active) */}
                        <div className="flex-none snap-center w-[85%] max-w-[320px]">
                            <Card className="flex gap-3 h-28 p-3 shadow-xl ring-2 ring-primary/50 border-primary/10 cursor-pointer transform scale-[1.02] transition-all">
                                <div className="w-24 h-full shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                                    <div className="absolute inset-0 bg-cover bg-center" data-alt="Latte art at The Daily Grind" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAgDja41P2oIgUza5vtJ-P_Py5HHfxl5qPj44JU3vtDtTelYxHtqOlf2oOj5D4vuaSh0VGQeJACbJ0rTauaLQmshbBfduA5CLoGfOTBy1Kl_U_fPyw3pSUAsiE6RgL7asO-ZH21ZhNojp0PNhvZyBlShTcq0C78z-vtptF9aWUQ5kZcl9tew5qvXxfOozs06Zm7OCWzrI95K3u7hkSXJSmm9NCt0fdScqfTFeLwDnz424wjND173rqvAc4TH8pijFzCQIuIo32CdVFu")' }}></div>
                                </div>
                                <div className="flex flex-col justify-between flex-1 py-0.5">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900 dark:text-white truncate">The Daily Grind</h3>
                                            <Badge variant="secondary" className="flex items-center text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded border-none shadow-none">
                                                4.8 <span className="material-symbols-outlined text-[10px] ml-0.5">star</span>
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Level 2 • Food Court</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs font-medium text-green-600 dark:text-green-400">Open • Closes 10PM</span>
                                        <span className="text-xs text-gray-400">5 min</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        {/* Card 3 */}
                        <div className="flex-none snap-center w-[85%] max-w-[320px]">
                            <Card className="flex gap-3 h-28 p-3 hover:shadow-xl transition-shadow cursor-pointer border-gray-100 dark:border-gray-700">
                                <div className="w-24 h-full shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                                    <div className="absolute inset-0 bg-cover bg-center" data-alt="Modern interior of Espresso Lab" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDHS3KDgVF1PPcqHliXTVmg3l4vVtJAXMedrtiwg1xzWdxIaigy7YWfaUmw2KkiS4nLpabgiga7_UMsQRlo3BJZyed8ebqsDAsoNC8HC3I9btjMo28SMttAN5NJrD17ukcnOhwgk5XDgPLvwHXlZ0hjXdLEweyfeJDjzx1_hdIEaqLtLZA8xXWK7wN1oeMBJv4oCSRynptRA4H-1ql2ZJvhev39KD0oOX5EV2PL6IiDtxhew_p9Xk_UvHIQxN2NChITYOlJuehvZSrg")' }}></div>
                                </div>
                                <div className="flex flex-col justify-between flex-1 py-0.5">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900 dark:text-white truncate">Espresso Lab</h3>
                                            <Badge variant="secondary" className="flex items-center text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded border-none shadow-none">
                                                4.2 <span className="material-symbols-outlined text-[10px] ml-0.5">star</span>
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Level 1 • West Wing</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Closing Soon</span>
                                        <span className="text-xs text-gray-400">8 min</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="w-2 shrink-0"></div> {/* Spacer */}
                    </div>
                </div>

                {/* Navigation Bar */}
                <nav className="absolute bottom-0 w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-5 pt-2 z-30">
                    <div className="flex justify-around items-center px-2">
                        <a className="flex flex-col items-center justify-center w-full gap-1 group" href="#">
                            <div className="p-1 rounded-full group-hover:bg-primary/10 transition-colors">
                                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
                            </div>
                            <span className="text-[10px] font-medium text-primary">Explore</span>
                        </a>
                        <a className="flex flex-col items-center justify-center w-full gap-1 group" href="#">
                            <div className="p-1 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
                                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300">format_list_bulleted</span>
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300">Saved</span>
                        </a>
                        <a className="flex flex-col items-center justify-center w-full gap-1 group" href="#">
                            <div className="p-1 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
                                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300">favorite</span>
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300">For You</span>
                        </a>
                        <a className="flex flex-col items-center justify-center w-full gap-1 group" href="#">
                            <div className="p-1 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
                                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300">person</span>
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300">Profile</span>
                        </a>
                    </div>
                </nav>
            </div>
        </div>
    )
};
