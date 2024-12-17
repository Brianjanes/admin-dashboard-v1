// src/types/mongodb.ts
export interface MongoDateType {
  $date: {
    $numberLong: string;
  };
}

export interface MongoNumberType {
  $numberInt: string;
}

export interface MongoIdType {
  $oid: string;
}
