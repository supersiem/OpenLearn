
export const ListContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col items-center justify-center min-w-screen bg-openlearn-800 rounded-max">
            {children}
        </div>
    )
}

export const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="border p-4 m-2 w-96 ">
            {children}
        </div>
    )
}