# Coordinate Translate

## GET Single Point for Process

```
/point/{from}/{to}/{srx}/{sry}
```

The first argument is `from` (source) coordinate type and second is `to` (destination) coordinate type (projection).


## POST Batch for Process

```
/point-batch
```

Batch your request with a collection as an array or an indexed object:

```json
{
  "from": "nad83moeastfipsft",
  "to": "wgs84",
  "collection": [
    {
      "x": 880850.176,
      "y": 1000390.347
    },
    {
      "x": 880345.176,
      "y": 1000390.347
    },
    {
      "x": 880809.176,
      "y": 1000390.347
    },
  ]
}
```

This will _usually_ return the items in the same location as when you provided it, but if you want to rely on your index, then use the below.

```json
{
  "from": "nad83moeastfipsft",
  "to": "wgs84",
  "collection": {
    "123456": {
      "x": 880850.176,
      "y": 1000390.347
    },
    "123457": {
      "x": 880345.176,
      "y": 1000390.347
    },
    "123458": {
      "x": 880809.176,
      "y": 1000390.347
    }
  }
}
```

This will return the objects with the new locations on the same index within the collection object as you provided.
