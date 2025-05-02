const turnOn = async (containerName) => {
    const res = await fetch('/api/container/turn-on/' + containerName, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await res.json();
    console.log(result);
};

const turnOff = async (containerName) => {
    const res = await fetch('/api/container/turn-off/' + containerName, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await res.json();
    console.log(result);
};

const getStatus = async (containerName) => {
    const res = await fetch('/api/container/status/' + containerName, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await res.json();
    console.log(result);
};