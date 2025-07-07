import { INestApplication } from '@nestjs/common';
import { SwaggerService } from './swagger.service';
import * as fs from 'fs';
import * as path from 'path';

export class SwaggerUtil {
  /**
   * Gera o arquivo JSON da especificação OpenAPI
   */
  static generateSpecFile(app: INestApplication, outputPath?: string) {
    const document = SwaggerService.generateSpec(app);
    const specPath = outputPath || path.join(process.cwd(), 'docs', 'swagger.json');
    
    // Cria o diretório se não existir
    const dir = path.dirname(specPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Escreve o arquivo JSON
    fs.writeFileSync(specPath, JSON.stringify(document, null, 2));
    
    console.log(`📄 Especificação OpenAPI gerada em: ${specPath}`);
    
    return specPath;
  }

  /**
   * Gera o arquivo YAML da especificação OpenAPI
   */
  static generateSpecFileYaml(app: INestApplication, outputPath?: string) {
    const document = SwaggerService.generateSpec(app);
    const specPath = outputPath || path.join(process.cwd(), 'docs', 'swagger.yaml');
    
    // Cria o diretório se não existir
    const dir = path.dirname(specPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Converte para YAML (requer js-yaml)
    const yaml = this.jsonToYaml(document);
    
    // Escreve o arquivo YAML
    fs.writeFileSync(specPath, yaml);
    
    console.log(`📄 Especificação OpenAPI (YAML) gerada em: ${specPath}`);
    
    return specPath;
  }

  /**
   * Converte JSON para YAML (simplificado)
   */
  private static jsonToYaml(obj: any, indent: number = 0): string {
    const spaces = '  '.repeat(indent);
    let yaml = '';
    
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        continue;
      }
      
      if (typeof value === 'object' && !Array.isArray(value)) {
        yaml += `${spaces}${key}:\n${this.jsonToYaml(value, indent + 1)}`;
      } else if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        for (const item of value) {
          if (typeof item === 'object') {
            yaml += `${spaces}  -\n${this.jsonToYaml(item, indent + 2)}`;
          } else {
            yaml += `${spaces}  - ${item}\n`;
          }
        }
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    }
    
    return yaml;
  }

  /**
   * Valida a especificação OpenAPI
   */
  static validateSpec(app: INestApplication): boolean {
    try {
      const document = SwaggerService.generateSpec(app);
      
      // Validações básicas
      if (!document.openapi) {
        console.error('❌ Especificação inválida: falta openapi version');
        return false;
      }
      
      if (!document.info) {
        console.error('❌ Especificação inválida: falta info');
        return false;
      }
      
      if (!document.paths || Object.keys(document.paths).length === 0) {
        console.error('❌ Especificação inválida: nenhum path encontrado');
        return false;
      }
      
      console.log('✅ Especificação OpenAPI válida');
      console.log(`📊 Endpoints encontrados: ${Object.keys(document.paths).length}`);
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao validar especificação:', error);
      return false;
    }
  }
} 