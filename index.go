package main

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"

	jsonpb "github.com/gogo/protobuf/jsonpb"
)

func main() {
	data := `{"id":"6481824a3243b6632460a5f7","request_id":"648187bc001ef23c4c2c5dcb","action_type":"SUBSCRIBE","campaign_id":"6481824a3243b6632460a5f7","merchant_id":"G527050780"}`
	jsonDecoder := json.NewDecoder(strings.NewReader(data))
	_, err := jsonDecoder.Token()
	if err != nil {
		log.Fatal(err)
	}
	var protoMessages []*pb.Container
	for jsonDecoder.More() {
		protoMessage := pb.Container{}
		err := jsonpb.UnmarshalNext(jsonDecoder, &protoMessage)
		if err != nil {
			log.Fatal(err)
		}
		protoMessages = append(protoMessages, &protoMessage)
	}
	fmt.Println("%s", protoMessages)
}
