const testCall = async (containerName) => {
    const res = await fetch('/api/container/turn-on', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ containerName })
    });

    const result = await res.json();
    console.log(result);
};