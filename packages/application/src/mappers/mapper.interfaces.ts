export interface Mapper<Source, Target> {
  map(source: Source): Target;
}

export interface AsyncMapper<Source, Target> {
  map(source: Source): Promise<Target>;
}

export interface DomainToDtoMapper<Domain, Dto> extends Mapper<Domain, Dto> {}
export interface DtoToDomainMapper<Dto, Domain> extends Mapper<Dto, Domain> {}
export interface DomainToPersistenceMapper<Domain, Persistence> extends Mapper<Domain, Persistence> {}
export interface PersistenceToDomainMapper<Persistence, Domain> extends Mapper<Persistence, Domain> {}
export interface DomainToAiMapper<Domain, Ai> extends Mapper<Domain, Ai> {}
export interface AiToDomainMapper<Ai, Domain> extends Mapper<Ai, Domain> {}