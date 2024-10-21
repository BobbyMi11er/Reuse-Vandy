export const handleJsonResponse = async (response: Response): Promise<any> => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error');
    }
    return await response.json();
};
