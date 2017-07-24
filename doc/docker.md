## Try Mem-Vis in Docker Container


First, pull the docker image from the Docker Hub:
```
docker pull jacksongl/ubuntu-mem-vis-pack
```

Start the container from the image:
```
docker run -p 5000:5000 -it ubuntu-mem-vis-pack bash
```

When you are inside the container, type the following command to get and serve a heap snapshot:
```
cd workspace/mem-vis-pack/
node mem-vis.js tests/crypto.js
```

Now, open [http://localhost:5000](http://localhost:5000) to view the heap snapshot.
