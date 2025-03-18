export const Table = ({ children }) => <table className="w-full border">{children}</table>;
export const Thead = ({ children }) => <thead className="bg-gray-200">{children}</thead>;
export const Tbody = ({ children }) => <tbody>{children}</tbody>;
export const Tr = ({ children }) => <tr className="border-b">{children}</tr>;
export const Th = ({ children }) => <th className="p-2 text-left">{children}</th>;
export const Td = ({ children }) => <td className="p-2">{children}</td>;