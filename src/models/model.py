import torch
import torch.nn as nn
from transformers import AutoModel

MODEL_NAME = "distilbert-base-uncased"

class DistilBERTClassifier(nn.Module):
    def __init__(self, num_labels=2):
        super(DistilBERTClassifier, self).__init__()
        
        self.bert = AutoModel.from_pretrained(MODEL_NAME)
        self.dropout = nn.Dropout(0.3)
        self.classifier = nn.Linear(self.bert.config.hidden_size, num_labels)
    
    def forward(self, input_ids, attention_mask):
        outputs = self.bert(
            input_ids=input_ids,
            attention_mask=attention_mask
        )
        
        hidden_state = outputs.last_hidden_state[:, 0]
        x = self.dropout(hidden_state)
        logits = self.classifier(x)
        
        return logits